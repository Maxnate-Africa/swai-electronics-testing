interface Props {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = '255123456789', 
  message = 'Hello! I am interested in your electronics products.' 
}: Props) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 32l6.826-2.054C10.47 31.276 13.12 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.342 22.616c-.39 1.1-1.932 2.012-3.182 2.278-.856.182-1.974.328-5.74-1.234-4.818-1.998-7.922-6.896-8.162-7.216-.232-.32-1.946-2.594-1.946-4.948 0-2.354 1.232-3.512 1.67-3.992.39-.428 1.022-.618 1.628-.618.196 0 .372.01.53.018.438.02.658.046.948.734.362.858 1.244 3.032 1.352 3.252.11.22.22.518.072.818-.14.308-.262.444-.482.698-.22.254-.428.448-.648.722-.198.244-.422.506-.178.944.244.436 1.086 1.792 2.332 2.902 1.602 1.426 2.91 1.882 3.372 2.082.358.156.784.124 1.038-.142.32-.336.716-.892 1.118-1.44.286-.39.646-.438 1.038-.292.396.14 2.506 1.182 2.936 1.398.43.218.716.326.822.51.104.182.104 1.064-.286 2.164v.002z"/>
      </svg>
    </a>
  );
}
