export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface PostIdParam {
  id: string;
}
