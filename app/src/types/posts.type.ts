export type Filter = {
  search: string;
};

export type PostIdParam = {
  id: string;
};

export type PostContent = {
  title: string;
  content: string;
  author: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};
