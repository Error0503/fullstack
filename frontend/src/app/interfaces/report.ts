import Build from "./build";

export default interface Report {
  id: number;
  status: string;
  body: string;
  reason: string;
  userId: number;
  post: Build;
}
