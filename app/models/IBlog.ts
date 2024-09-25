export type BlogRequest = {
  title: string;
  url: string;
  author: string;
  publishDate: string;
  imageUrl: string;
};

export type BlogResponse = {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  publishDate: string;
  author: string;
  createdAt:string;
};
