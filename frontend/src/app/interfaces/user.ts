import Build from "./build";
import Comment from "./comment";

export default interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  posts?: Build[];
}
