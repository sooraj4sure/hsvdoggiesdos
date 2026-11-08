export const CLINIC = {
  name: "Doggie Do's Pet Salon",
  tagline: "Family-owned since 2009 — grooming, cage-free daycare & boarding for Huntsville's dogs.",
  address: "3409 Governors Dr SW, Huntsville, AL 35805",
  phone: "+1 (256) 533-3383",
  phoneRaw: "+12565333383",
  whatsappRaw: "+12565333383",
  email: "bclundberg40@gmail.com",
  mapsUrl: "https://maps.google.com/?q=3409+Governors+Dr+SW+Huntsville+AL+35805",
  hours: "Mon–Thu 7:30 AM–5:30 PM, Fri 7:30 AM–4:00 PM, Sat 9:00 AM–4:00 PM. Sunday closed.",
};

/** The 15 dog services (seed + booking form share this list). Dogs only — no cats. */
export const REASONS_FOR_VISIT = [
  "Full Groom",
  "Bath & Blow Dry",
  "Haircut & Styling",
  "Nail Trim",
  "De-shedding Treatment",
  "Puppy's First Groom",
  "Spa Bath",
  "Breed Cut",
  "Puppy Bath",
  "Senior Dog Groom",
  "Ear Cleaning",
  "Teeth Cleaning",
  "Paw Care",
  "Cage-Free Daycare",
  "Boarding (Dog Condos)",
] as const;
