import { useCallback, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { FaAddressCard, FaQrcode, FaApple } from "react-icons/fa";
import {
  generateVCard,
  generateAppleContactURL,
} from "../../utils/contactUtils";
import { profile } from "../../config/profile";

export const ContactDownload = () => {
  const vCardData = generateVCard(profile);
  const appleContactURL = generateAppleContactURL(profile);
  const qrCode = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 150,
      height: 150,
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
  }, [vCardData]);

  const downloadVCard = useCallback(() => {
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.name}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [vCardData]);

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <div className="flex space-x-4">
        {/* VCard Download Button */}
        <button
          onClick={downloadVCard}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaAddressCard />
          <span>Download Contact Card</span>
        </button>

        {/* Apple Contacts Button */}
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

      {/* QR Code Section */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-lg font-semibold flex items-center space-x-2">
          <FaQrcode />
          <span>Scan to add contact</span>
        </div>
        <div className="p-2 bg-white rounded-lg">
          <div ref={qrRef} />
        </div>
      </div>
    </div>
  );
};
