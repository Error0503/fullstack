export default interface Report {
  id: number;
  status: string;
  body: string;
  reason: string;
  userId: number;
  postId: number;
}
