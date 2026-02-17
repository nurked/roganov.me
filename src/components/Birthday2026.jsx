import { NavBar } from "./navbar/NavBar";
import { Footer } from "./Footter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import React from "react";

const getPlatform = () => {
  // Try modern API first
  if (navigator.userAgentData?.platform) {
    return navigator.userAgentData.platform.toLowerCase();
  }

  // Fallback to user agent checking
  const userAgent = navigator.userAgent.toLowerCase();
  if (
    userAgent.includes("mac") ||
    userAgent.includes("iphone") ||
    userAgent.includes("ipad")
  ) {
    return "macos";
  }

  return "other";
};

const generateCalendarEvent = (language) => {
  const event = {
    title: language === "ru" ? "День Рождения Ивана" : "Ivan's Birthday Party",
    description:
      language === "ru"
        ? "Празднование дня рождения в парке Крест Лейк"
        : "Birthday celebration at Crest Lake Park",
    location: "Crest Lake Park, Clearwater, FL",
    startDate: "2026-02-21T10:00:00",
    endDate: "2026-02-21T18:00:00",
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${event.startDate.replace(/[-:]/g, "")}`,
      `DTEND:${event.endDate.replace(/[-:]/g, "")}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "birthday_event.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } else {
    const googleUrl = encodeURI(
      [
        "https://calendar.google.com/calendar/render",
        "?action=TEMPLATE",
        `&text=${event.title}`,
        `&details=${event.description}`,
        `&location=${event.location}`,
        `&dates=${event.startDate.replace(/[-:]/g, "")}`,
        `/${event.endDate.replace(/[-:]/g, "")}`,
      ].join(""),
    );
    window.open(googleUrl, "_blank");
  }
};

const MAPS_URLS = {
  google: "https://maps.app.goo.gl/FDGxRS2xBsVR4ZWA8",
  apple: "https://maps.apple/p/ZIFUWUKhvIuLDC",
};

const contentBlocks = [
  {
    type: "text",
    en: "Hello everyone! I invite you to my birthday celebration! Come for an amazing open-air sport barbeque event! ALL are invited. Bring your friends!",
    ru: "Всем привет! Приглашаю вас на свой день рождения! Приходите на потрясающее спортивное барбекю мероприятие на открытом воздухе! ВСЕ приглашены. Приводите своих друзей!",
  },
  {
    type: "fullwidth-image",
    src: "/park-2026.jpg",
    alt: {
      en: "Crest Lake Park",
      ru: "Парк Крест Лейк",
    },
  },
  {
    type: "text",
    en: "This year we're celebrating at Crest Lake Park in Clearwater! The main event starts at noon. There will be a lot of interesting activities: paddle boarding, volleyball, basketball, badminton, frisbee tournament and many others. Enjoy delicious BBQ, outdoor sports, and great company!",
    ru: "В этом году мы празднуем в парке Крест Лейк в Клируотере! Основное мероприятие начинается в полдень. Будет много интересных активностей: паддлбординг, волейбол, баскетбол, бадминтон, турнир по фрисби и многое другое. Наслаждайтесь вкусным барбекю, спортом на открытом воздухе и отличной компанией!",
  },
  {
    type: "text",
    en: `<strong>Event Details:</strong><br>
         Time: 10:00 PM (Noon), February 21, 2026<br>
         Location: Crest Lake Park<br>
         Address: Clearwater, FL<br><br>
         Please RSVP to confirm your attendance!`,
    ru: `<strong>Детали события:</strong><br>
         Время: 10:00 (Полдень), 21 Февраля 2026 года<br>
         Место: Парк Крест Лейк<br>
         Адрес: Clearwater, FL<br><br>
         Пожалуйста, подтвердите что вы идёте!`,
  },
  {
    type: "text",
    en: `<strong>What should I give as a gift?</strong><br><br>
         If you want to make a present, you can use this <a href="https://www.amazon.com/hz/wishlist/ls/1C6NMOXEVD7L4?ref_=wl_share" class="text-blue-600 hover:text-blue-800 underline">Amazon wishlist</a> or donate towards my future services via <a href="https://www.paypal.com/pool/9m3GcDeC6F?sr=wccr" class="text-blue-600 hover:text-blue-800 underline">PayPal</a> or <a href="https://buy.stripe.com/5kQ8wQf5x3yd09a7f25EY0u" class="text-blue-600 hover:text-blue-800 underline">Stripe</a>. But honestly, your presence is the best gift!`,
    ru: `<strong>Что мне подарить?</strong><br><br>
         Если вы хотите сделать подарок, можете воспользоваться <a href="https://www.amazon.com/hz/wishlist/ls/1C6NMOXEVD7L4?ref_=wl_share" class="text-blue-600 hover:text-blue-800 underline">этим списком в Амазоне</a> или сделать пожертвование на мои будущие услуги через <a href="https://www.paypal.com/pool/9m3GcDeC6F?sr=wccr" class="text-blue-600 hover:text-blue-800 underline">PayPal</a> или <a href="https://buy.stripe.com/5kQ8wQf5x3yd09a7f25EY0u" class="text-blue-600 hover:text-blue-800 underline">Stripe</a>. Но честно говоря, ваше присутствие - лучший подарок!`,
  },
  {
    type: "text",
    en: "I'm looking forward to seeing everyone! It will be an amazing day filled with sports, games, great food, and wonderful company!",
    ru: "Я с нетерпением жду всех! Это будет потрясающий день, наполненный спортом, играми, отличной едой и замечательной компанией!",
  },
  {
    type: "fullwidth-map",
    googleSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.5!2d-82.7668!3d27.9665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDU3JzU5LjQiTiA4MsKwNDYnMDAuNSJX!5e0!3m2!1sen!2sus!4v1234567890",
    appleMapsUrl: MAPS_URLS.apple,
    title: {
      en: "Crest Lake Park",
      ru: "Парк Крест Лейк",
    },
  },
];

const CalendarButton = ({ language }) => (
  <button
    onClick={() => generateCalendarEvent(language)}
    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mb-8"
  >
    {language === "ru"
      ? "Сохранить событие в календарь"
      : "Save event to calendar"}
  </button>
);

CalendarButton.propTypes = {
  language: PropTypes.oneOf(["en", "ru"]).isRequired,
};

const paragraphVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const TextBlock = ({ content, language, isMobile }) => (
  <motion.div
    variants={paragraphVariants}
    className={`text-lg text-gray-700 leading-relaxed ${
      isMobile ? "mb-8 px-4" : ""
    }`}
    dangerouslySetInnerHTML={{ __html: content[language] }}
  />
);

const FullWidthImage = ({ src, alt }) => (
  <motion.div
    variants={paragraphVariants}
    className="col-span-2 w-full px-0 my-0"
  >
    <img src={src} alt={alt.en} className="w-full shadow-lg" />
  </motion.div>
);

const FullWidthMap = ({ googleSrc, appleMapsUrl, title }) => {
  const [platform, setPlatform] = useState("other");

  useEffect(() => {
    setPlatform(getPlatform());
  }, []);

  return (
    <motion.div
      variants={paragraphVariants}
      className="col-span-2 w-full px-8 my-8 space-y-4"
    >
      <div className="h-[400px]">
        {platform === "macos" ? (
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full h-full bg-gray-100 rounded-lg items-center justify-center"
          >
            <div className="text-center p-4">
              <p className="text-lg mb-2">Click to open in Apple Maps</p>
              <p className="text-sm text-gray-600">
                For the best experience on your device
              </p>
            </div>
          </a>
        ) : (
          <iframe
            src={googleSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title.en}
            className="rounded-lg shadow-lg"
          />
        )}
      </div>
      <div className="text-center text-sm text-gray-600">
        <p>
          If you can&apos;t see the map, open in{" "}
          <a
            href={MAPS_URLS.google}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Google Maps
          </a>{" "}
          or{" "}
          <a
            href={MAPS_URLS.apple}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Apple Maps
          </a>
        </p>
      </div>
    </motion.div>
  );
};

TextBlock.propTypes = {
  content: PropTypes.shape({
    en: PropTypes.string,
    ru: PropTypes.string,
  }).isRequired,
  language: PropTypes.oneOf(["en", "ru"]).isRequired,
  isMobile: PropTypes.bool,
};

FullWidthImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.shape({
    en: PropTypes.string,
    ru: PropTypes.string,
  }).isRequired,
};

FullWidthMap.propTypes = {
  googleSrc: PropTypes.string.isRequired,
  appleMapsUrl: PropTypes.string.isRequired,
  title: PropTypes.shape({
    en: PropTypes.string,
    ru: PropTypes.string,
  }).isRequired,
};

export const Birthday2026 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    setIsVisible(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check URL parameters for language preference
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (langParam === "en") {
      setLanguage("en");
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ru" ? "en" : "ru"));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto">
          {isMobile && (
            <div className="px-4 mb-8">
              <button
                onClick={toggleLanguage}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === "ru" ? "Switch to English" : "Показать по-русски"}
              </button>
            </div>
          )}

          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className={`grid grid-cols-1 ${
              isMobile ? "" : "md:grid-cols-2"
            } gap-8 md:gap-16`}
          >
            {isMobile ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 px-4">
                  {language === "ru" ? "День Рождения" : "Birthday Celebration"}
                </h2>
                <div className="px-4">
                  <CalendarButton language={language} />
                </div>
                <div className="space-y-8">
                  {contentBlocks.map((block, index) => {
                    switch (block.type) {
                      case "fullwidth-image":
                        return (
                          <div className="px-4" key={`image-${index}`}>
                            <FullWidthImage {...block} />
                          </div>
                        );
                      case "fullwidth-map":
                        return (
                          <div className="px-4" key={`map-${index}`}>
                            <FullWidthMap {...block} />
                          </div>
                        );
                      case "text":
                        return (
                          <TextBlock
                            key={`text-${index}`}
                            content={block}
                            language={language}
                            isMobile={true}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
                <div className="px-4">
                  <CalendarButton language={language} />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 px-4">
                  Birthday Celebration
                </h2>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 px-4">
                  День Рождения
                </h2>
                <div className="px-4">
                  <CalendarButton language="en" />
                </div>
                <div className="px-4">
                  <CalendarButton language="ru" />
                </div>
                {contentBlocks.map((block, index) => {
                  switch (block.type) {
                    case "fullwidth-image":
                      return (
                        <FullWidthImage key={`image-${index}`} {...block} />
                      );
                    case "fullwidth-map":
                      return <FullWidthMap key={`map-${index}`} {...block} />;
                    case "text":
                      return (
                        <React.Fragment key={`text-${index}`}>
                          <TextBlock content={block} language="en" />
                          <TextBlock content={block} language="ru" />
                        </React.Fragment>
                      );
                    default:
                      return null;
                  }
                })}
                <div className="px-4">
                  <CalendarButton language="en" />
                </div>
                <div className="px-4">
                  <CalendarButton language="ru" />
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
