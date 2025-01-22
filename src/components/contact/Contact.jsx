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

export const Contact = () => {
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
        width: 400,
        height: 400,
        data: vCardData,
        dotsOptions: {
          color: "#000000",
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

  return (
    <div id="contact" className="w-full min-h-screen flex flex-col mt-24 pb-24">
      <div className="flex-grow basis-1/3 flex flex-col justify-center items-center px-4 sm:px-8 md:px-16">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center text-center">
          <span>Get in Touch</span>
          <span className="ml-2 w-1 h-8 bg-green-500 animate-blink"></span>
        </h1>

        <ul className="mt-4 text-sm sm:text-base space-y-1 text-left w-full max-w-md mb-24 list-disc pl-4">
          <li>Software development. Solving any IT-related problems</li>
          <li>Business and entertainment event organization</li>
          <li>Professional in-time translation</li>
          <li>A/V equipment setups and training</li>
          <li>Personal consultation</li>
          <li>Anything I can help you with</li>
        </ul>
      </div>

      <div className="flex-grow bg-gray-200 flex flex-col justify-start items-center px-4 sm:px-8 md:px-16 pb-24">
        <div className="text-center sm:mt-28 mt-24 lg:mt-16 space-y-4 relative">
          <h2 className="text-xl sm:text-2xl">
            Just give me a call, <br />I would love to hear from
          </h2>

          <div className="flex flex-col items-center mt-4 space-y-4 w-full max-w-md sm:max-w-lg">
            <div className="flex items-center justify-start w-full ml-0 md:ml-64">
              <a
                href={`https://wa.me/${profile.contact.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <FaWhatsapp className="text-3xl sm:text-4xl mr-4" />
                <span className="text-lg sm:text-2xl">
                  {profile.contact.phone}
                </span>
              </a>
            </div>

            <div className="flex items-center justify-start w-full ml-0 md:ml-64">
              <a
                href={`mailto:${profile.contact.email}`}
                className="flex items-center"
              >
                <FaEnvelope className="text-3xl sm:text-4xl mr-4" />
                <span className="text-lg sm:text-2xl">
                  {profile.contact.email}
                </span>
              </a>
            </div>

            <div className="flex items-center justify-start w-full ml-0 md:ml-64">
              <a
                href={`mailto:${profile.contact.businessEmail}`}
                className="flex items-center"
              >
                <FaEnvelope className="text-3xl sm:text-4xl mr-4" />
                <span className="text-lg sm:text-2xl">
                  {profile.contact.businessEmail}
                </span>
              </a>
            </div>

            <div className="flex items-center justify-start w-full ml-0 md:ml-64">
              <a
                href={profile.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <FaTelegramPlane className="text-3xl sm:text-4xl mr-4" />
                <span className="text-lg sm:text-2xl">@nurked</span>
              </a>
            </div>

            <div className="flex items-center justify-start w-full ml-0 md:ml-64">
              <FaLinkedin className="text-3xl sm:text-4xl mr-4" />
              <span className="text-lg sm:text-2xl">
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/ivan-roganov
                </a>
              </span>
            </div>

            <div className="flex items-center justify-start w-full ml-0 md:ml-64">
              <FaMapMarkerAlt className="text-3xl sm:text-4xl mr-4" />
              <span className="text-lg sm:text-2xl">{profile.location}</span>
            </div>

            {isMobile && (
              <div className="flex space-x-4">
                <button
                  onClick={downloadVCard}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaAddressCard />
                  <span>Download Contact Card</span>
                </button>

                <a
                  href={appleContactURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FaApple />
                  <span>Add to iOS Contacts</span>
                </a>
              </div>
            )}

            {!isMobile && (
              <div className="flex flex-col items-center space-y-2 mb-24">
                <div className="text-lg flex items-center space-x-2">
                  <FaQrcode />
                  <span>Scan to add contact</span>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <div ref={qrRef} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
