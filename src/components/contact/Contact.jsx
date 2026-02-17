import { profile } from "../../config/profile";
import {
  FaEnvelope,
  FaWhatsapp,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaLinkedin,
  FaAddressCard,
  FaQrcode,
  FaApple,
} from "react-icons/fa";
import {
  generateVCard,
  generateAppleContactURL,
} from "../../utils/contactUtils";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import en from "../../i18n/en.json";
import ru from "../../i18n/ru.json";

export default function Contact({ lang = "en" }) {
  const strings = lang === "ru" ? ru.contact : en.contact;
  const vCardData = generateVCard(profile);
  const appleContactURL = generateAppleContactURL(profile);
  const qrCode = useRef(null);
  const qrRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (qrRef.current && !isMobile) {
      qrRef.current.innerHTML = "";
      qrCode.current = new QRCodeStyling({
        width: 300,
        height: 300,
        data: vCardData,
        dotsOptions: {
          color: "#0F67B1",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
        },
      });

      qrCode.current.append(qrRef.current);
    }
  }, [vCardData, isMobile]);

  const downloadVCard = () => {
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.name}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const contactMethods = [
    {
      icon: FaWhatsapp,
      color: "#25D366",
      label: profile.contact.phone,
      href: `https://wa.me/${profile.contact.phone.replace(/\D/g, "")}`,
      external: true,
    },
    {
      icon: FaEnvelope,
      color: "#3B82F6",
      label: profile.contact.email,
      href: `mailto:${profile.contact.email}`,
    },
    {
      icon: FaEnvelope,
      color: "#8B5CF6",
      label: profile.contact.businessEmail,
      href: `mailto:${profile.contact.businessEmail}`,
    },
    {
      icon: FaTelegramPlane,
      color: "#229ED9",
      label: "@nurked",
      href: profile.social.telegram,
      external: true,
    },
    {
      icon: FaLinkedin,
      color: "#0A66C2",
      label: "ivan-roganov",
      href: profile.social.linkedin,
      external: true,
    },
    {
      icon: FaMapMarkerAlt,
      color: "#EF4444",
      label: profile.location,
    },
  ];

  return (
    <div id="contact" className="w-full py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            {lang === "ru" ? "Контакт" : "Contact"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight flex items-center">
            <span>{strings.title}</span>
            <span className="ml-2 w-1 h-8 bg-green-500 animate-blink"></span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-4"></div>
        </div>

        {/* Services list */}
        <ul className="mb-16 space-y-3 max-w-lg">
          {strings.services.map((service, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-300">
              <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {service}
            </li>
          ))}
        </ul>

        {/* Contact info heading */}
        <h3 className="text-xl md:text-2xl text-gray-300 mb-8 text-center">
          {strings.callText} <br />{strings.callText2}
        </h3>

        {/* Contact methods grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            const content = (
              <div
                key={index}
                className="flex items-center gap-4 p-5 rounded-xl bg-surface-card border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${method.color}20` }}>
                  <Icon className="text-xl" style={{ color: method.color }} />
                </div>
                <span className="text-gray-300 text-sm md:text-base truncate">{method.label}</span>
              </div>
            );

            if (method.href) {
              return (
                <a
                  key={index}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  {content}
                </a>
              );
            }
            return content;
          })}
        </div>

        {/* Mobile buttons */}
        {isMobile && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={downloadVCard}
              className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FaAddressCard />
              <span>{strings.downloadCard}</span>
            </button>

            <a
              href={appleContactURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              <FaApple />
              <span>{strings.addToIOS}</span>
            </a>
          </div>
        )}

        {/* QR Code (desktop) */}
        {!isMobile && (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg flex items-center gap-2 text-gray-400">
              <FaQrcode />
              <span>{strings.scanToAdd}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="p-3 bg-white rounded-xl">
                <div ref={qrRef} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
