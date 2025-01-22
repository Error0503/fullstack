import Comment from './comment';

export default interface Build {
  user: { id: number; username: string };
  id: number;
  heroId: number;
  title: string;
  shortDescription: string;
  body: {
    description: string;
    weaponItems: string[];
    vitalityItems: string[];
    spiritItems: string[];
    flexItems: { name: string; category: string }[];
  };
  comments: Comment[];
}
