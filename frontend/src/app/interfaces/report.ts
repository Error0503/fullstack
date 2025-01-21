import Post from "./post";

export default interface Report {
  id: number;
  status: string;
  body: string;
  reason: string;
  userId: number;
  post: Post;
}
