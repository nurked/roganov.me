export const generateCalendarEvent = (language) => {
  const event = {
    title: language === "ru" ? "День Рождения Ивана" : "Ivan's Birthday Party",
    description:
      language === "ru"
        ? "Празднование дня рождения в парке Фреда Говарда, укрытие 08"
        : "Birthday celebration at Fred Howard Park, Shelter 08",
    location:
      "Fred Howard Park Shelter 08, 1700 Sunset Dr Tarpon Springs, 34689",
    startDate: "2025-02-15T10:00:00",
    endDate: "2025-02-15T18:00:00",
  };

  // Format for Google Calendar
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

  // Format for iCal (Apple Calendar)
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

  return { googleUrl, icsContent };
};
