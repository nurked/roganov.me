import { useState } from 'react';

export default function NavBarMobile({ lang }) {
  const [isOpen, setIsOpen] = useState(false);

  const labels = lang === 'ru'
    ? { portfolio: 'Портфолио', contact: 'Контакт', blog: 'Блог', birthday: 'День Рождения 2026', switchLang: 'Switch to English' }
    : { portfolio: 'Portfolio', contact: 'Contact', blog: 'Blog', birthday: 'Birthday 2026', switchLang: 'Показать по-русски' };

  const base = lang === 'ru' ? '/ru' : '';
  const altBase = lang === 'ru' ? '' : '/ru';

  return (
    <>
      <div className="sm:hidden rounded-full flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </div>

      {isOpen && (
        <div className="sm:hidden absolute top-14 right-0 left-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 z-50">
          <ul className="py-4 px-6 space-y-1">
            <li><a href={`${base}/#superhero`} className="block py-3 text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>{labels.portfolio}</a></li>
            <li><a href={`${base}/#contact`} className="block py-3 text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>{labels.contact}</a></li>
            <li><a href={`${base}/blog/`} className="block py-3 text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>{labels.blog}</a></li>
            <li><a href={`${base}/birthday-2026/`} className="block py-3 text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>{labels.birthday}</a></li>
            <li className="border-t border-white/10 pt-3 mt-2">
              <a href={`${altBase}/`} className="flex items-center gap-2 py-3 text-gray-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                {labels.switchLang}
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
