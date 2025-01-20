export default interface Comment {
  id: number;
  commenterUsername: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  postId: number;
}
