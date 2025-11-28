/* 
 * MAXNATE Admin Panel JavaScript
 * Universal Content Management System
 */

// ==================== STATE MANAGEMENT ====================

let currentUser = null;
let currentWebsite = 'swai-electronics';
let currentContentType = 'projects';
let currentStatusFilter = 'all';
const WEBSITE_STORAGE_KEY = 'maxcms.currentWebsite';

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

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
	console.log('✅ MaxCMS initialized');
    
	// Password show/hide toggle
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
    
	// Check if user is already logged in
	checkAuthState();
});

// ==================== AUTHENTICATION (LOCAL STORAGE) ====================

function checkAuthState() {
	const storedUser = localStorage.getItem('maxcms_user');
	if (storedUser) {
		try {
			currentUser = JSON.parse(storedUser);
			console.log('✅ User authenticated:', currentUser.email);
			document.getElementById('user-email').textContent = currentUser.email;
			showDashboard();
			loadWebsites();
		} catch (e) {
			console.error('Invalid stored user data');
			localStorage.removeItem('maxcms_user');
			showLogin();
		}
	} else {
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

		// Simple local authentication (replace with your backend API)
		if (email && password) {
			currentUser = { email, uid: Date.now().toString() };
			localStorage.setItem('maxcms_user', JSON.stringify(currentUser));
			console.log('✅ User logged in');
			document.getElementById('user-email').textContent = currentUser.email;
			showDashboard();
			loadWebsites();
		} else {
			throw new Error('Invalid credentials');
		}
        
	} catch (error) {
		console.error('Login error:', error);
		alert('Login failed. Please check your credentials.');
        
		const submitBtn = loginForm.querySelector('button[type="submit"]');
		submitBtn.textContent = 'Login to Dashboard';
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
		localStorage.removeItem('maxcms_user');
		currentUser = null;
		console.log('✅ User logged out');
		showLogin();
	} catch (error) {
		console.error('Logout error:', error);
		alert('Logout failed. Please try again.');
	}
});

// ==================== WEBSITE MANAGEMENT ====================

function loadWebsites() {
	// Load websites from localStorage or use default
	const stored = localStorage.getItem('maxcms_websites');
	if (stored) {
		try {
			availableWebsites = JSON.parse(stored);
		} catch (e) {
			availableWebsites = [];
		}
	}
    
	if (availableWebsites.length === 0) {
		createDefaultWebsite();
	} else {
		const storedWebsite = localStorage.getItem(WEBSITE_STORAGE_KEY);
		if (storedWebsite && availableWebsites.some(w => w.id === storedWebsite)) {
			currentWebsite = storedWebsite;
		} else {
			currentWebsite = availableWebsites[0].id;
		}
	}

	ensureWebsiteSwitcher();
	syncWebsiteUI();
	loadContent();
}

function createDefaultWebsite() {
	availableWebsites = [{
		id: 'swai-electronics',
		name: 'Swai Electronics',
		domain: 'swaielectronics.co.tz',
		ownerId: currentUser.uid,
		createdAt: new Date().toISOString(),
		settings: {
			theme: 'light',
			primaryColor: '#1a73e8'
		}
	}];
    
	localStorage.setItem('maxcms_websites', JSON.stringify(availableWebsites));
	localStorage.setItem(WEBSITE_STORAGE_KEY, 'swai-electronics');
	currentWebsite = 'swai-electronics';
	console.log('✅ Default website created');
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
        
		navItems.forEach(nav => nav.classList.remove('active'));
		item.classList.add('active');
        
		currentContentType = section;
		switchSection(section);
		loadContent();
	});
});

function switchSection(section) {
	document.querySelectorAll('.content-section').forEach(sec => {
		sec.classList.remove('active');
	});
	document.getElementById(`${section}-section`).classList.add('active');
    
	const config = CONTENT_TYPES[section];
	if (config) {
		document.getElementById('section-title').textContent = config.title;
		currentStatusFilter = 'all';
		ensureStatusFilters();
		selectedIds = new Set();
		ensureBulkToolbar();
		updateBulkToolbar();
		ensureWebsiteSwitcher();
		syncWebsiteUI();
	} else {
		document.getElementById('section-title').textContent = 'Settings';
	}
}

// ==================== CONTENT CRUD (LOCAL STORAGE) ====================

function getStorageKey(contentType, websiteId) {
	return `maxcms_${websiteId}_${contentType}`;
}

function loadContent() {
	try {
		const key = getStorageKey(currentContentType, currentWebsite);
		const stored = localStorage.getItem(key);
        
		if (stored) {
			currentContent = JSON.parse(stored);
		} else {
			currentContent = [];
		}
        
		// Sort by creation date (newest first)
		currentContent.sort((a, b) => {
			const dateA = new Date(a.createdAt || 0);
			const dateB = new Date(b.createdAt || 0);
			return dateB - dateA;
		});
        
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

function saveContent() {
	try {
		const key = getStorageKey(currentContentType, currentWebsite);
		localStorage.setItem(key, JSON.stringify(currentContent));
	} catch (error) {
		console.error('Error saving content:', error);
		alert('Failed to save content. Storage may be full.');
	}
}

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

function createContentCard(item) {
	const card = document.createElement('div');
	card.className = 'content-item';
    
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
    
	const checkbox = card.querySelector('.select-item');
	checkbox.addEventListener('change', (e) => {
		toggleItemSelection(item.id, e.target.checked);
	});
    
	return card;
}

async function editContent(id) {
	const item = currentContent.find(c => c.id === id);
	if (!item) return;

	isEditMode = true;
	editingContentId = id;
    
	const config = CONTENT_TYPES[currentContentType];
	document.getElementById('modal-title').textContent = `Edit ${config.singular}`;
	document.getElementById('content-type').value = currentContentType;
	document.getElementById('content-id').value = item.id;
    
	document.getElementById('content-title').value = item.title || '';
	document.getElementById('content-description').value = item.description || '';
	document.getElementById('content-status').value = item.status || 'published';
    
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
    
	updateConditionalFields();
	contentModal.classList.add('active');
}

async function deleteContent(id) {
	if (!confirm(`Are you sure you want to delete this ${currentContentType.slice(0, -1)}?`)) {
		return;
	}

	try {
		currentContent = currentContent.filter(item => item.id !== id);
		saveContent();
		console.log('✅ Content deleted');
		loadContent();
	} catch (error) {
		console.error('Error deleting content:', error);
		alert('Failed to delete. Please try again.');
	}
}

contentForm.addEventListener('submit', async (e) => {
	e.preventDefault();
    
	const contentData = {
		title: document.getElementById('content-title').value,
		description: document.getElementById('content-description').value,
		status: document.getElementById('content-status').value,
		updatedAt: new Date().toISOString()
	};
    
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
    
	const imageUrl = document.getElementById('content-image').value;
	if (imageUrl) {
		contentData.image = imageUrl;
	}

	try {
		if (isEditMode) {
			const index = currentContent.findIndex(item => item.id === editingContentId);
			if (index !== -1) {
				currentContent[index] = { ...currentContent[index], ...contentData };
				console.log('✅ Content updated');
			}
		} else {
			contentData.id = 'item_' + Date.now();
			contentData.createdAt = new Date().toISOString();
			currentContent.unshift(contentData);
			console.log('✅ Content created');
		}

		saveContent();
		closeModal();
		loadContent();
        
	} catch (error) {
		console.error('Error saving content:', error);
		alert('Failed to save. Please try again.');
	}
});

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

// ==================== IMAGE HANDLING ====================

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

document.getElementById('content-image-file').addEventListener('change', async (e) => {
	const file = e.target.files[0];
	if (!file) return;
    
	try {
		// Convert to base64 data URL for local storage
		const reader = new FileReader();
		reader.onload = (event) => {
			const dataUrl = event.target.result;
			document.getElementById('content-image').value = dataUrl;
            
			const preview = document.getElementById('image-preview');
			const img = document.getElementById('preview-img');
			img.src = dataUrl;
			preview.classList.add('active');
            
			console.log('✅ Image loaded');
		};
		reader.readAsDataURL(file);
	} catch (error) {
		console.error('Error loading image:', error);
		alert('Image upload failed. File may be too large.');
	}
});

// ==================== MODAL MANAGEMENT ====================

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

function closeModal() {
	contentModal.classList.remove('active');
	contentForm.reset();
	document.getElementById('image-preview').classList.remove('active');
}

contentModal.addEventListener('click', (e) => {
	if (e.target === contentModal) {
		closeModal();
	}
});

// ==================== STATUS FILTERS ====================

function ensureStatusFilters() {
	const sectionEl = document.getElementById(`${currentContentType}-section`);
	if (!sectionEl) return;
	const listEl = document.getElementById(`${currentContentType}-list`);
	if (!listEl) return;

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

		filtersEl.querySelectorAll('.status-tab').forEach(btn => {
			btn.addEventListener('click', () => {
				filtersEl.querySelectorAll('.status-tab').forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
				currentStatusFilter = btn.getAttribute('data-status');
				renderContent();
			});
		});
        
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
				updateConditionalFields();
				contentModal.classList.add('active');
			});
		}
	}

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
		const filtersEl = sectionEl.querySelector('.status-filters');
		if (filtersEl && filtersEl.nextSibling) {
			sectionEl.insertBefore(toolbar, filtersEl.nextSibling);
		} else {
			sectionEl.insertBefore(toolbar, listEl);
		}

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
		const addBtn = document.getElementById('add-content-btn');
		header.insertBefore(switcher, addBtn);
	}

	const select = switcher.querySelector('#website-switcher-select');
	select.innerHTML = '';
	availableWebsites.forEach(w => {
		const opt = document.createElement('option');
		opt.value = w.id;
		opt.textContent = w.name || w.id;
		select.appendChild(opt);
	});
	select.value = currentWebsite;

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

	const publishBtn = toolbar.querySelector(`#${currentContentType}-bulk-publish`);
	const unpublishBtn = toolbar.querySelector(`#${currentContentType}-bulk-unpublish`);
	const deleteBtn = toolbar.querySelector(`#${currentContentType}-bulk-delete`);
	const disabled = selectedCount === 0;
	if (publishBtn) publishBtn.disabled = disabled;
	if (unpublishBtn) unpublishBtn.disabled = disabled;
	if (deleteBtn) deleteBtn.disabled = disabled;

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
		currentContent.forEach(item => {
			if (ids.includes(item.id)) {
				item.status = newStatus;
				item.updatedAt = new Date().toISOString();
			}
		});
		saveContent();
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
		currentContent = currentContent.filter(item => !ids.includes(item.id));
		saveContent();
		selectedIds = new Set();
		await loadContent();
		alert(`Deleted ${ids.length} item(s).`);
	} catch (error) {
		console.error('Bulk delete error:', error);
		alert('Failed to delete items. Please try again.');
	}
}

// ==================== GLOBAL FUNCTIONS ====================

window.editContent = editContent;
window.deleteContent = deleteContent;
