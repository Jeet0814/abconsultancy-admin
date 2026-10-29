export type TestimonialItem = {
  id: string;
  name: string;
  service: string | null;
  message: string;
  rating: number | null;
};

/**
 * Pre-approved testimonials can be listed here, or loaded dynamically from database.
 * If left empty ([]), approved testimonials are loaded from the database,
 * and if none exist yet, the polished 'Be the first to share your experience' state is shown.
 */
export const initialTestimonials: TestimonialItem[] = [];
