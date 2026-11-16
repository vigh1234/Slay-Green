// Site-wide settings. Contact details are optional: set them in client/.env
// (see .env.example) and they appear on the Contact page and in the footer.
// Anything left empty is simply not shown.
export const SITE = {
  name: "Slay Green",
  tagline: "Live greener",
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || "",
    phone: import.meta.env.VITE_CONTACT_PHONE || "",
    address: import.meta.env.VITE_CONTACT_ADDRESS || "",
  },
  social: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || "",
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN || "",
    x: import.meta.env.VITE_SOCIAL_X || "",
  },
};
