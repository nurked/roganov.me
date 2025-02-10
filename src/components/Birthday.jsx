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
        ? "Празднование дня рождения в парке Фреда Говарда"
        : "Birthday celebration at Fred Howard Park",
    location: "Fred Howard Park, 1700 Sunset Dr Tarpon Springs, 34689",
    startDate: "2025-02-23T11:00:00",
    endDate: "2025-02-23T18:00:00",
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
  google:
    "https://www.google.com/maps?q=Fred+Howard+Park+Shelter+08,+1700+Sunset+Dr+Tarpon+Springs,+34689",
  apple:
    "https://maps.apple.com/?ll=28.156136,-82.788120&q=Tarpon%20Springs%20%E2%80%94%20Pinellas%20County&spn=0.002511,0.004231&t=h",
};

const contentBlocks = [
  {
    type: "text",
    en: "Hello everyone! I invite you to my birthday celebration! As you remember, I prefer to celebrate my birthday with a huge company in a beautiful place. This year, I want to invite you to Fred Howard Park.",
    ru: "Всем привет! Приглашаю вас на свой день рождения! Как вы помните, я предпочитаю праздновать свой день рождения в огромной компании в красивом месте. И в этом году я хочу пригласить вас в парк Фреда Ховарда.",
  },
  {
    type: "fullwidth-image",
    src: "/park-2025.png",
    alt: {
      en: "Fred Howard Park",
      ru: "Парк Фреда Ховарда",
    },
  },
  {
    type: "text",
    en: "What kind of park is this? Oh, it's an excellent park just 10 miles from Clearwater, where you can not only relax with friends while enjoying delicious meat that I'll prepare on the grill, but also visit the beach, ride bikes, have great entertainment, and play sports games as well as lots of different board games. Come join us, it will be fun!",
    ru: "Что это за парк? О, это отличный парк в 10 милях от Клируотера, где вы можете не только отдохнуть в компании друзей, поедая вкусное мясо, которое я приготовлю на грилле, но и проехаться на пляж, покататься на велосипедах, отлично развлечься, и поиграть в спортивные игры а так же в кучу различных настолок. Приезжайте, будет весело.",
  },
  {
    type: "text",
    en: `<strong>Event Details:</strong><br>
         Time: 11 AM, February 23, 2025<br>
         Location: Fred Howard Park<br>
         Address: 1700 Sunset Dr Tarpon Springs, 34689<br>
         (Parking fee: $6 per car for the whole day)<br><br>
         Please RSVP at <a href="https://www.icloud.com/invites/0d5tgXSqPg_9YQ4fWa36r2VSQ" class="text-blue-600 hover:text-blue-800 underline">this link</a>`,
    ru: `<strong>Детали события:</strong><br>
         Время: 11 утра, 23 Февраля 2025 года<br>
         Место: Парк Фреда Говарда<br>
         Адрес: 1700 Sunset Dr Tarpon Springs, 34689<br>
         (Парковка платная - $6 за машину на весь день)<br><br>
         Пожалуйста, подтвердите что вы идёте <a href="https://www.icloud.com/invites/0d5tgXSqPg_9YQ4fWa36r2VSQ" class="text-blue-600 hover:text-blue-800 underline">по этой ссылке</a>.`,
  },
  {
    type: "text",
    en: `<strong>What should I give as a gift?</strong><br><br>
         I don't know, lots of little things. I love surprises. If you really don't want to choose, you can check out this <a href="https://www.amazon.com/hz/wishlist/ls/1C6NMOXEVD7L4?ref_=wl_share" class="text-blue-600 hover:text-blue-800 underline">Amazon wishlist</a>. And if you don't want to bother with that either, you can contribute here on PayPal <a href="https://www.paypal.com/pool/9cbluNSh51?sr=wccr" class="text-blue-600 hover:text-blue-800 underline">PayPal</a> or just bring an envelope with a card.<br><br>
         And if someone helps me pay for all the Super Power, I can definitely say that the celebration was a great success!`,
    ru: `<strong>Что мне подарить?</strong><br><br>
         Не знаю, много мелочей. Я люблю сюрпризы. Если вам очень не хочется выбирать, то можно подсмотреть вот в <a href="https://www.amazon.com/hz/wishlist/ls/1C6NMOXEVD7L4?ref_=wl_share" class="text-blue-600 hover:text-blue-800 underline">этом списке в Амазоне</a>. А если даже с этим не хочется заморачиваться, то можете закинуть вот здесь на <a href="https://www.paypal.com/pool/9cbluNSh51?sr=wccr" class="text-blue-600 hover:text-blue-800 underline">PayPal</a> или просто принести конвертик с открыткой.<br><br>
         А если кто-то поможет мне оплатить всю Супер Силу, то я точно смогу сказать, что праздник удался на славу!`,
  },
  {
    type: "text",
    en: "I'm looking forward to seeing everyone! It will be fun. Last year we gathered more than 120 people, this year I hope there will be even more of us!",
    ru: "Я с нетерпением жду всех! Будет весело. В прошлом году мы собрали больше 120 человек, в этом году я надеюсь, что нас будет больше!",
  },
  {
    type: "fullwidth-map",
    googleSrc:
      "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1474.607667819882!2d-82.78789097732296!3d28.15607094585079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1739154486422!5m2!1sen!2sus",
    appleMapsUrl: MAPS_URLS.apple,
    title: {
      en: "Fred Howard Park",
      ru: "Парк Фреда Говарда",
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

export const Birthday = () => {
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
