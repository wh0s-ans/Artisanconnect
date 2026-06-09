import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Update document direction for Arabic RTL support
    document.documentElement.dir = lng.startsWith('ar') ? 'rtl' : 'ltr';
    // Update html lang attribute for SEO and accessibility
    document.documentElement.lang = lng;
  };

  const isArabic = i18n.language.startsWith('ar');

  return (
    <div 
      ref={dropdownRef}
      className="relative flex items-center justify-center p-2 text-editorial-muted hover:text-editorial-accent transition-colors"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-1.5 rounded-full hover:bg-black/5 transition-colors focus:outline-none"
        aria-label="Select Language"
      >
        <Globe className="h-5 w-5" />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full mt-2 w-36 bg-editorial-bg border border-editorial-border rounded-md shadow-lg z-50 ${isArabic ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}
        >
          <div className="py-1">
            <button
              onClick={() => { changeLanguage('fr'); setIsOpen(false); }}
              className={`block w-full text-start px-4 py-2.5 text-sm hover:bg-editorial-accent/10 transition-colors ${i18n.language.startsWith('fr') ? 'font-bold text-editorial-accent' : 'text-editorial-fg'}`}
            >
              Français
            </button>
            <button
              onClick={() => { changeLanguage('en'); setIsOpen(false); }}
              className={`block w-full text-start px-4 py-2.5 text-sm hover:bg-editorial-accent/10 transition-colors ${i18n.language.startsWith('en') ? 'font-bold text-editorial-accent' : 'text-editorial-fg'}`}
            >
              English
            </button>
            <button
              onClick={() => { changeLanguage('ar'); setIsOpen(false); }}
              className={`block w-full text-start px-4 py-2.5 text-sm hover:bg-editorial-accent/10 transition-colors ${i18n.language.startsWith('ar') ? 'font-bold text-editorial-accent' : 'text-editorial-fg'}`}
            >
              العربية
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
