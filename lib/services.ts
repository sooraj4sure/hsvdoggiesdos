/** Services shown on the home page and the Services page.
 * Each service is an image card — photo on top, title, description,
 * duration + fee, and the services it covers. Not a plain box + text.
 * Dogs only — Doggie Do's is a dogs-only salon. */
export const SERVICES = [
  {
    slug: "full-groom",
    title: "Full Groom",
    image: "/images/service-general.jpg",
    imageAlt: "A happy freshly groomed dog at Doggie Do's Pet Salon",
    description:
      "The complete package: warm bath, blow dry, haircut, brush-out and a tidy finish — your dog leaves looking (and smelling) their best.",
    duration: "60 min per session",
    fee: "From $45",
    reasons: ["Full Groom", "Bath & Blow Dry", "Haircut & Styling", "Breed Cut"],
  },
  {
    slug: "puppy-first-groom",
    title: "Puppy's First Groom",
    image: "/images/service-children.jpg",
    imageAlt: "A puppy enjoying a gentle first grooming session",
    description:
      "A slow, gentle first groom for puppies — a warm bath, a light trim and lots of patience, so grooming becomes something they love.",
    duration: "45 min per session",
    fee: "From $35",
    reasons: ["Puppy's First Groom", "Puppy Bath", "Bath & Blow Dry", "Haircut & Styling"],
  },
  {
    slug: "de-shedding-coat-care",
    title: "De-shedding & Coat Care",
    image: "/images/service-skin.jpg",
    imageAlt: "De-shedding treatment for a thick-coated dog",
    description:
      "Deep de-shedding bath, undercoat removal and coat conditioning — less hair on your sofa, a healthier coat on your dog.",
    duration: "60 min per session",
    fee: "From $55",
    reasons: ["De-shedding Treatment", "Bath & Blow Dry", "Spa Bath"],
  },
  {
    slug: "spa-bath",
    title: "Spa Bath & Relaxation",
    image: "/images/service-heart.jpg",
    imageAlt: "A dog enjoying a relaxing spa bath",
    description:
      "A calm, pampering spa bath with gentle shampoo, ear cleaning and a relaxing brush-out — a proper treat day for your dog.",
    duration: "45–60 min per session",
    fee: "From $45",
    reasons: ["Spa Bath", "Bath & Blow Dry", "Ear Cleaning", "Teeth Cleaning"],
  },
  {
    slug: "nail-paw-ear-care",
    title: "Nail, Paw & Ear Care",
    image: "/images/service-physio.jpg",
    imageAlt: "Gentle Dremel nail trim and paw care for a dog",
    description:
      "Gentle Dremel nail grinding — no clippers, no quick — plus paw balm and ear cleaning. The little things that keep your dog comfortable between full grooms.",
    duration: "30 min per session",
    fee: "From $25",
    reasons: ["Nail Trim", "Paw Care", "Ear Cleaning"],
  },
  {
    slug: "cage-free-daycare",
    title: "Cage-Free Daycare",
    image: "/images/clinic.jpg",
    imageAlt: "Dogs playing together in cage-free daycare",
    description:
      "A full day of fun in cage-free daycare — dogs play in groups matched by size and energy level, supervised all day in a safe space.",
    duration: "Full day",
    fee: "From $30",
    reasons: ["Cage-Free Daycare"],
  },
  {
    slug: "boarding-dog-condos",
    title: "Boarding in Dog Condos",
    image: "/images/service-boarding.jpg",
    imageAlt: "A dog resting comfortably in a spacious dog condo",
    description:
      "Comfortable boarding in spacious dog condos — and our team stays on site overnight, so your dog is never alone.",
    duration: "Per night",
    fee: "From $40",
    reasons: ["Boarding (Dog Condos)"],
  },
];
