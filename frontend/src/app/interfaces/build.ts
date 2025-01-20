import Item from "./item";

export default interface Build {
  id: number;
  heroId: number;
  title: string;
  shortDescription: string;
  body: {
    description: string;
    weaponItems: Item[];
    vitalityItems: Item[];
    spiritItems: Item[];
    flexItems: Item[];
  };
}
