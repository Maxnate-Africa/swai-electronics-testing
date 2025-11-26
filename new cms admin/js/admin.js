/* 
 * MAXNATE Admin Panel JavaScript
 * Universal Content Management System with Firebase
 */

// ==================== FIREBASE INITIALIZATION ====================

let auth, db, storage;
let currentUser = null;
let currentWebsite = 'h2major'; // Default website
let currentContentType = 'projects'; // Current section
let currentStatusFilter = 'all'; // All | published | draft
const WEBSITE_STORAGE_KEY = 'maxnate.currentWebsite';

// Initialize Firebase
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Guard against duplicate initialization
        if (!firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        
        console.log('✅ Firebase initialized successfully');
        
        // Check authentication state
        auth.onAuthStateChanged(handleAuthStateChange);

        // Password show/hide toggle on login
        const toggleBtn = document.getElementById('toggle-password');
        const pwdInput = document.getElementById('password');
        if (toggleBtn && pwdInput) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = pwdInput.type === 'password';
                pwdInput.type = isHidden ? 'text' : 'password';
                toggleBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
                toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
                toggleBtn.title = isHidden ? 'Hide password' : 'Show password';
                const eye = toggleBtn.querySelector('.icon-eye');
                const eyeOff = toggleBtn.querySelector('.icon-eye-off');
                if (eye && eyeOff) {
                    eye.style.display = isHidden ? 'none' : '';
                    eyeOff.style.display = isHidden ? '' : 'none';
                }
            });
        }
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        alert('Firebase configuration error. Please check firebase-config.js');
    }
});

// ==================== STATE MANAGEMENT ====================

let currentContent = [];
let isEditMode = false;
let editingContentId = null;
let availableWebsites = [];
let selectedIds = new Set();

// Content type configurations
const CONTENT_TYPES = {
    projects: {
        title: 'Manage Projects',
        singular: 'Project',
        fields: ['title', 'description', 'category', 'image', 'status']
    },
    announcements: {
        title: 'Manage Announcements',
        singular: 'Announcement',
        fields: ['title', 'description', 'priority', 'status']
    },
    offers: {
        title: 'Manage Special Offers',
        singular: 'Offer',
        fields: ['title', 'description', 'discount', 'expiry', 'image', 'status']
    }
};

// ==================== DOM ELEMENTS ====================

const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const contentModal = document.getElementById('content-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const contentForm = document.getElementById('content-form');
const navItems = document.querySelectorAll('.nav-item[data-section]');

// ==================== AUTHENTICATION ====================

// Handle Authentication State Changes
function handleAuthStateChange(user) {
    if (user) {
        currentUser = user;
        console.log('✅ User authenticated:', user.email);
        document.getElementById('user-email').textContent = user.email;
        showDashboard();
        loadWebsites();
    } else {
        currentUser = null;
        console.log('⚠️ No user authenticated');
        showLogin();
    }
}

// Login Form Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        await auth.signInWithEmailAndPassword(email, password);
        
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Login failed. Please check your credentials.';
        
        if (error.code === 'auth/user-not-found') {
            message = 'No account found with this email.';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Incorrect password.';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Invalid email address format.';
        }
        
        alert(message);
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function showLogin() {
    loginScreen.classList.add('active');
    adminDashboard.classList.remove('active');
    loginForm.reset();
}

function showDashboard() {
    loginScreen.classList.remove('active');
    adminDashboard.classList.add('active');
}

// Logout Handler
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await auth.signOut();
        console.log('✅ User logged out');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
    }
});

// ==================== WEBSITE MANAGEMENT ====================

// Load Available Websites
async function loadWebsites() {
    try {
        const websitesSnapshot = await db.collection('websites').get();
        availableWebsites = websitesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        if (availableWebsites.length === 0) {
            await createDefaultWebsite();
            await loadWebsites();
        } else {
            // Determine current website from storage or defaults
            const stored = localStorage.getItem(WEBSITE_STORAGE_KEY);
            const hasStored = stored && availableWebsites.some(w => w.id === stored);
            if (hasStored) {
                currentWebsite = stored;
            } else if (!availableWebsites.some(w => w.id === currentWebsite)) {
                // If the default isn't present, use the first
                currentWebsite = availableWebsites[0].id;
            }

            ensureWebsiteSwitcher();
            syncWebsiteUI();
            loadContent();
        }
    } catch (error) {
        console.error('Error loading websites:', error);
        alert('Failed to load websites. Check console for details.');
    }
}

// Create Default Website
async function createDefaultWebsite() {
    try {
        await db.collection('websites').doc('h2major').set({
            name: 'H2 Major Store',
            domain: 'h2majorstore.com',
            ownerId: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            settings: {
                theme: 'dark',
                primaryColor: '#EB1C2C'
            }
        });
        console.log('✅ Default website created');
        currentWebsite = 'h2major';
        localStorage.setItem(WEBSITE_STORAGE_KEY, currentWebsite);
    } catch (error) {
        console.error('Error creating default website:', error);
    }
}

// ==================== NAVIGATION ====================

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        
        if (section === 'settings') {
            switchSection(section);
            return;
        }
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Switch content type
        currentContentType = section;
        switchSection(section);
        loadContent();
    });
});

function switchSection(section) {
    // Update UI
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Update header title
    const config = CONTENT_TYPES[section];
    if (config) {
        document.getElementById('section-title').textContent = config.title;
        // Reset status filter when switching content types
        currentStatusFilter = 'all';
        ensureStatusFilters();
        // Reset selections when switching sections
        selectedIds = new Set();
        ensureBulkToolbar();
        updateBulkToolbar();
        ensureWebsiteSwitcher();
        syncWebsiteUI();
    } else {
        document.getElementById('section-title').textContent = 'Settings';
    }
}

// ==================== CONTENT CRUD (UNIVERSAL) ====================

// Load Content from Firestore
async function loadContent() {
    try {
        const contentRef = db.collection('websites')
            .doc(currentWebsite)
            .collection(currentContentType);
        
        const snapshot = await contentRef.orderBy('createdAt', 'desc').get();
        
        currentContent = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        ensureStatusFilters();
        ensureBulkToolbar();
        updateStatusCounts();
        renderContent();
        updateBulkToolbar();
    } catch (error) {
        console.error('Error loading content:', error);
        currentContent = [];
        ensureStatusFilters();
        ensureBulkToolbar();
        updateStatusCounts();
        renderContent();
        updateBulkToolbar();
    }
}

// Render Content List
function getFilteredContent() {
    return currentStatusFilter === 'all'
        ? currentContent
        : currentContent.filter(item => (item.status || 'draft') === currentStatusFilter);
}

function renderContent() {
    const listContainer = document.getElementById(`${currentContentType}-list`);
    listContainer.innerHTML = '';
    
    const itemsToRender = getFilteredContent();

    if (itemsToRender.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#6C757D; padding:3rem;">No ${currentContentType} yet. Click "Add New" to get started!</p>`;
        updateBulkToolbar();
        return;
    }

    itemsToRender.forEach(item => {
        const card = createContentCard(item);
        listContainer.appendChild(card);
    });
    updateBulkToolbar();
}

// Create Content Card
function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'content-item';
    
    // Build metadata badges
    let metaBadges = '';
    
    if (item.status) {
        metaBadges += `<span class="status-${item.status}">${item.status}</span>`;
    }
    
    if (item.category) {
        metaBadges += `<span>${item.category}</span>`;
    }
    
    if (item.priority) {
        metaBadges += `<span class="priority-${item.priority}">${item.priority} priority</span>`;
    }
    
    if (item.discount) {
        metaBadges += `<span>${item.discount}</span>`;
    }
    
    if (item.expiry) {
        const expiryDate = new Date(item.expiry);
        metaBadges += `<span>Expires: ${expiryDate.toLocaleDateString()}</span>`;
    }
    
    // Image section (if applicable)
    let imageHTML = '';
    if (item.image) {
        imageHTML = `
            <div class="content-item-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/600x400/1A1A2E/E63946?text=No+Image'">
            </div>
        `;
    }
    
    const isChecked = selectedIds.has(item.id) ? 'checked' : '';
    card.innerHTML = `
        <div class="select-checkbox">
            <input type="checkbox" class="select-item" data-id="${item.id}" ${isChecked} />
        </div>
        ${imageHTML}
        <div class="content-item-content">
            <h3>${item.title}</h3>
            <p>${item.description || item.excerpt || ''}</p>
            ${metaBadges ? `<div class="content-meta">${metaBadges}</div>` : ''}
            <div class="content-actions">
                <button class="btn-edit" onclick="editContent('${item.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteContent('${item.id}')">Delete</button>
            </div>
        </div>
    `;
    // Hook selection toggle
    const checkbox = card.querySelector('.select-item');
    checkbox.addEventListener('change', (e) => {
        toggleItemSelection(item.id, e.target.checked);
    });
    
    return card;
}

// Note: Add New Content button is now dynamically created in ensureStatusFilters()
// and event listener is attached there

// Edit Content
async function editContent(id) {
    const item = currentContent.find(c => c.id === id);
    if (!item) return;

    isEditMode = true;
    editingContentId = id;
    
    const config = CONTENT_TYPES[currentContentType];
    document.getElementById('modal-title').textContent = `Edit ${config.singular}`;
    document.getElementById('content-type').value = currentContentType;
    document.getElementById('content-id').value = item.id;
    
    // Populate form fields
    document.getElementById('content-title').value = item.title || '';
    document.getElementById('content-description').value = item.description || '';
    document.getElementById('content-status').value = item.status || 'published';
    
    // Type-specific fields
    if (item.category) document.getElementById('content-category').value = item.category;
    if (item.priority) {
        const pr = document.querySelector(`input[name="announcement-priority"][value="${item.priority}"]`);
        if (pr) pr.checked = true;
    }
    if (item.discount) document.getElementById('offer-discount').value = item.discount;
    if (item.expiry) document.getElementById('offer-expiry').value = item.expiry;
    if (item.image) {
        document.getElementById('content-image').value = item.image;
        const preview = document.getElementById('image-preview');
        document.getElementById('preview-img').src = item.image;
        preview.classList.add('active');
    }
    
    // Show/hide conditional fields
    updateConditionalFields();
    
    contentModal.classList.add('active');
}

// Delete Content
async function deleteContent(id) {
    if (!confirm(`Are you sure you want to delete this ${currentContentType.slice(0, -1)}?`)) {
        return;
    }

    try {
        await db.collection('websites')
            .doc(currentWebsite)
            .collection(currentContentType)
            .doc(id)
            .delete();
        
        console.log('✅ Content deleted');
        loadContent();
    } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete. Please try again.');
    }
}

// Save Content Form
contentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contentData = {
        title: document.getElementById('content-title').value,
        description: document.getElementById('content-description').value,
        status: document.getElementById('content-status').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Add type-specific fields
    if (currentContentType === 'projects') {
        contentData.category = document.getElementById('content-category').value;
    } else if (currentContentType === 'announcements') {
        const selectedPriority = document.querySelector('input[name="announcement-priority"]:checked');
        if (!selectedPriority) {
            alert('Please select a priority for the announcement.');
            return;
        }
        contentData.priority = selectedPriority.value;
    } else if (currentContentType === 'offers') {
        contentData.discount = document.getElementById('offer-discount').value;
        contentData.expiry = document.getElementById('offer-expiry').value;
    }
    
    // Add image if provided
    const imageUrl = document.getElementById('content-image').value;
    if (imageUrl) {
        contentData.image = imageUrl;
    }

    try {
        if (isEditMode) {
            // Update existing content
            await db.collection('websites')
                .doc(currentWebsite)
                .collection(currentContentType)
                .doc(editingContentId)
                .update(contentData);
            
            console.log('✅ Content updated');
        } else {
            // Create new content
            contentData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            
            await db.collection('websites')
                .doc(currentWebsite)
                .collection(currentContentType)
                .add(contentData);
            
            console.log('✅ Content created');
        }

        closeModal();
        loadContent();
        
    } catch (error) {
        console.error('Error saving content:', error);
        alert('Failed to save. Please try again.');
    }
});

// Update Conditional Fields Visibility
function updateConditionalFields() {
    const allConditional = document.querySelectorAll('.conditional-field');
    allConditional.forEach(field => {
        const showFor = field.getAttribute('data-show-for');
        if (showFor === currentContentType) {
            field.classList.add('visible');
        } else {
            field.classList.remove('visible');
        }
    });
}

// ==================== IMAGE UPLOAD ====================

// Image Preview
document.getElementById('content-image').addEventListener('input', (e) => {
    const imageUrl = e.target.value;
    if (imageUrl) {
        const preview = document.getElementById('image-preview');
        const img = document.getElementById('preview-img');
        img.src = imageUrl;
        preview.classList.add('active');
        
        img.onerror = () => {
            img.src = 'https://via.placeholder.com/600x400/1A1A2E/E63946?text=Invalid+URL';
        };
    }
});

// File Upload Handler
document.getElementById('content-image-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        // Show upload progress (simplified for now)
        const uploadURL = await uploadImageToFirebase(file);
        document.getElementById('content-image').value = uploadURL;
        
        // Show preview
        const preview = document.getElementById('image-preview');
        const img = document.getElementById('preview-img');
        img.src = uploadURL;
        preview.classList.add('active');
        
        console.log('✅ Image uploaded:', uploadURL);
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Image upload failed. Please try again.');
    }
});

// Upload Image to Firebase Storage
async function uploadImageToFirebase(file) {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`${currentContentType}/${currentWebsite}/${filename}`);
    
    const snapshot = await imageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    return downloadURL;
}

// ==================== MODAL MANAGEMENT ====================

// Close Modal
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

function closeModal() {
    contentModal.classList.remove('active');
    contentForm.reset();
    document.getElementById('image-preview').classList.remove('active');
}

// Close modal on outside click
contentModal.addEventListener('click', (e) => {
    if (e.target === contentModal) {
        closeModal();
    }
});

// ==================== UTILITY FUNCTIONS ====================

// Make functions available globally for onclick handlers
window.editContent = editContent;
window.deleteContent = deleteContent;

// ==================== STATUS FILTERS ====================

function ensureStatusFilters() {
    const sectionEl = document.getElementById(`${currentContentType}-section`);
    if (!sectionEl) return;
    const listEl = document.getElementById(`${currentContentType}-list`);
    if (!listEl) return;

    // If a filter bar for this section already exists, just sync active state
    let filtersEl = sectionEl.querySelector('.status-filters');
    if (!filtersEl) {
        filtersEl = document.createElement('div');
        filtersEl.className = 'status-filters';
        filtersEl.innerHTML = `
            <button class="status-tab" data-status="all">All <span class="badge" id="${currentContentType}-count-all">0</span></button>
            <button class="status-tab" data-status="published">Published <span class="badge" id="${currentContentType}-count-published">0</span></button>
            <button class="status-tab" data-status="draft">Draft <span class="badge" id="${currentContentType}-count-draft">0</span></button>
            <button id="add-content-btn" class="btn-primary">+ Add New</button>
        `;
        sectionEl.insertBefore(filtersEl, listEl);

        // Wire tab clicks
        filtersEl.querySelectorAll('.status-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                filtersEl.querySelectorAll('.status-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentStatusFilter = btn.getAttribute('data-status');
                renderContent();
            });
        });
        
        // Wire add button
        const addBtn = filtersEl.querySelector('#add-content-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                isEditMode = false;
                editingContentId = null;
                
                const config = CONTENT_TYPES[currentContentType];
                document.getElementById('modal-title').textContent = `Add New ${config.singular}`;
                document.getElementById('content-type').value = currentContentType;
                
                contentForm.reset();
                document.getElementById('image-preview').classList.remove('active');
                
                // Show/hide conditional fields
                updateConditionalFields();
                
                contentModal.classList.add('active');
            });
        }
    }

    // Sync active tab
    filtersEl.querySelectorAll('.status-tab').forEach(btn => {
        if (btn.getAttribute('data-status') === currentStatusFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateStatusCounts() {
    const total = currentContent.length;
    const published = currentContent.filter(i => (i.status || 'draft') === 'published').length;
    const draft = currentContent.filter(i => (i.status || 'draft') === 'draft').length;

    const allEl = document.getElementById(`${currentContentType}-count-all`);
    const pubEl = document.getElementById(`${currentContentType}-count-published`);
    const draftEl = document.getElementById(`${currentContentType}-count-draft`);
    if (allEl) allEl.textContent = total;
    if (pubEl) pubEl.textContent = published;
    if (draftEl) draftEl.textContent = draft;
}

// ==================== BULK ACTIONS ====================

function ensureBulkToolbar() {
    const sectionEl = document.getElementById(`${currentContentType}-section`);
    if (!sectionEl) return;
    const listEl = document.getElementById(`${currentContentType}-list`);
    if (!listEl) return;

    let toolbar = sectionEl.querySelector('.bulk-toolbar');
    if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.className = 'bulk-toolbar';
        toolbar.innerHTML = `
            <label class="select-all">
                <input type="checkbox" id="${currentContentType}-select-all" />
                <span>Select all</span>
            </label>
            <div class="bulk-actions">
                <button class="btn-secondary" id="${currentContentType}-bulk-publish" disabled>Publish</button>
                <button class="btn-secondary" id="${currentContentType}-bulk-unpublish" disabled>Unpublish</button>
                <button class="btn-delete" id="${currentContentType}-bulk-delete" disabled>Delete</button>
            </div>
            <div class="bulk-count"><span id="${currentContentType}-selected-count">0</span> selected</div>
        `;
        // Insert after status filters if present, otherwise before list
        const filtersEl = sectionEl.querySelector('.status-filters');
        if (filtersEl && filtersEl.nextSibling) {
            sectionEl.insertBefore(toolbar, filtersEl.nextSibling);
        } else {
            sectionEl.insertBefore(toolbar, listEl);
        }

        // Wire events
        const selectAll = toolbar.querySelector(`#${currentContentType}-select-all`);
        selectAll.addEventListener('change', (e) => {
            const items = getFilteredContent();
            if (e.target.checked) {
                items.forEach(i => selectedIds.add(i.id));
            } else {
                items.forEach(i => selectedIds.delete(i.id));
            }
            renderContent();
        });

        toolbar.querySelector(`#${currentContentType}-bulk-publish`).addEventListener('click', async () => {
            await bulkUpdateStatus('published');
        });
        toolbar.querySelector(`#${currentContentType}-bulk-unpublish`).addEventListener('click', async () => {
            await bulkUpdateStatus('draft');
        });
        toolbar.querySelector(`#${currentContentType}-bulk-delete`).addEventListener('click', async () => {
            await bulkDelete();
        });
    }
}

// ==================== WEBSITE SWITCHER ====================

function ensureWebsiteSwitcher() {
    const header = document.querySelector('.content-header');
    if (!header) return;
    let switcher = header.querySelector('.website-switcher');
    if (!switcher) {
        switcher = document.createElement('div');
        switcher.className = 'website-switcher';
        switcher.innerHTML = `
            <label for="website-switcher-select">Website:</label>
            <select id="website-switcher-select"></select>
        `;
        // Insert before the Add button
        const addBtn = document.getElementById('add-content-btn');
        header.insertBefore(switcher, addBtn);
    }

    const select = switcher.querySelector('#website-switcher-select');
    // Rebuild options from availableWebsites
    select.innerHTML = '';
    availableWebsites.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w.id;
        opt.textContent = w.name || w.id;
        select.appendChild(opt);
    });
    select.value = currentWebsite;

    // Bind change once
    if (!select.dataset.bound) {
        select.addEventListener('change', () => {
            setCurrentWebsite(select.value);
        });
        select.dataset.bound = '1';
    }
}

function syncWebsiteUI() {
    const select = document.getElementById('website-switcher-select');
    if (select) select.value = currentWebsite;
    const info = document.getElementById('current-website');
    if (info) {
        const w = availableWebsites.find(x => x.id === currentWebsite);
        info.textContent = w ? (w.name || w.id) : currentWebsite;
    }
}

function setCurrentWebsite(websiteId) {
    if (!websiteId || websiteId === currentWebsite) return;
    currentWebsite = websiteId;
    try { localStorage.setItem(WEBSITE_STORAGE_KEY, currentWebsite); } catch {}
    // Reset per-website UI state
    selectedIds = new Set();
    currentStatusFilter = 'all';
    ensureStatusFilters();
    ensureBulkToolbar();
    syncWebsiteUI();
    loadContent();
}

function updateBulkToolbar() {
    const sectionEl = document.getElementById(`${currentContentType}-section`);
    if (!sectionEl) return;
    const toolbar = sectionEl.querySelector('.bulk-toolbar');
    if (!toolbar) return;

    const selectedCount = selectedIds.size;
    const countEl = toolbar.querySelector(`#${currentContentType}-selected-count`);
    if (countEl) countEl.textContent = selectedCount;

    // Enable/disable buttons
    const publishBtn = toolbar.querySelector(`#${currentContentType}-bulk-publish`);
    const unpublishBtn = toolbar.querySelector(`#${currentContentType}-bulk-unpublish`);
    const deleteBtn = toolbar.querySelector(`#${currentContentType}-bulk-delete`);
    const disabled = selectedCount === 0;
    if (publishBtn) publishBtn.disabled = disabled;
    if (unpublishBtn) unpublishBtn.disabled = disabled;
    if (deleteBtn) deleteBtn.disabled = disabled;

    // Sync select-all checkbox based on filtered view
    const items = getFilteredContent();
    const allSelected = items.length > 0 && items.every(i => selectedIds.has(i.id));
    const selectAll = toolbar.querySelector(`#${currentContentType}-select-all`);
    if (selectAll) selectAll.checked = allSelected;
}

function toggleItemSelection(id, checked) {
    if (checked) selectedIds.add(id);
    else selectedIds.delete(id);
    updateBulkToolbar();
}

async function bulkUpdateStatus(newStatus) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Set status to "${newStatus}" for ${ids.length} item(s)?`)) return;
    try {
        const batch = db.batch();
        ids.forEach(id => {
            const ref = db.collection('websites')
                .doc(currentWebsite)
                .collection(currentContentType)
                .doc(id);
            batch.update(ref, { status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        });
        await batch.commit();
        selectedIds = new Set();
        await loadContent();
        alert(`Updated ${ids.length} item(s).`);
    } catch (error) {
        console.error('Bulk status update error:', error);
        alert('Failed to update items. Please try again.');
    }
}

async function bulkDelete() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} item(s)? This cannot be undone.`)) return;
    try {
        const batch = db.batch();
        ids.forEach(id => {
            const ref = db.collection('websites')
                .doc(currentWebsite)
                .collection(currentContentType)
                .doc(id);
            batch.delete(ref);
        });
        await batch.commit();
        selectedIds = new Set();
        await loadContent();
        alert(`Deleted ${ids.length} item(s).`);
    } catch (error) {
        console.error('Bulk delete error:', error);
        alert('Failed to delete items. Please try again.');
    }
}
