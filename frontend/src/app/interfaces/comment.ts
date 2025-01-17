export default interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  postId: number;
}
