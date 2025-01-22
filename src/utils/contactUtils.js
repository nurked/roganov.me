export const generateVCard = (profile) => {
  // Create vCard data manually
  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    `N:${profile.name.split(" ").reverse().join(";")};`,
    `TITLE:${profile.position}`,
    `ORG:${profile.company}`,
    `TEL;TYPE=WORK,VOICE,CELL:${profile.contact.phone}`,
    `EMAIL;TYPE=WORK:${profile.contact.email}`,
    `EMAIL;TYPE=WORK:${profile.contact.businessEmail}`,
    `URL;TYPE=WORK:${profile.social.linkedin}`,
    `URL;TYPE=SOCIAL:${profile.social.telegram}`,
    "END:VCARD",
  ].join("\n");

  return vCard;
};

// For iOS devices
export const generateAppleContactURL = (profile) => {
  const contact = {
    fn: profile.name,
    tel: profile.contact.phone,
    email: profile.contact.email,
    url: profile.social.linkedin,
    org: profile.company,
  };

  const parameters = Object.entries(contact)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `https://contacts.google.com/person/create?${parameters}`;
};
