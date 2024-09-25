export type TestimonialResponse = {
  id: string;
  name: string;
  text: string;
  imageUrl: string;
  reviewLink: string;
  ratingNumber: number;
};

export type TestimonialRequest  = {
  name: string;
  text: string;
  reviewLink: string;
  ratingNumber: number;
  base64ImageUrl: string;
};
