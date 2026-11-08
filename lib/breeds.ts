/** Common dog breeds for the booking flow's "Select breed" step.
 * "Other" lets the pet parent type a breed that is not listed. */
export const DOG_BREEDS = [
  "Labrador",
  "Golden Retriever",
  "German Shepherd",
  "Poodle",
  "Doodle",
  "Beagle",
  "Bulldog",
  "Husky",
  "Maltipoo",
  "Shih Tzu",
  "Chihuahua",
  "Dachshund",
  "Boxer",
  "Pomeranian",
  "Cocker Spaniel",
  "Mixed breed",
  "Other",
] as const;

export type DogBreed = (typeof DOG_BREEDS)[number];
