import Comment from "./comment";
import Post from "./post";

export default interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  posts?: Post[];
}
