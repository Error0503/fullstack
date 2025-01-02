import Effect from "./effect";

export default interface Item {
  category: string;
  name: string;
  cost: number;
  effects: Effect[] | [];
  activeEffects: Effect[] | [];
  conditionalEffects: Effect[] | [];
  description: string | null;
  components: string | null;
  componentOf: string | null;
  // image: string | null;
}
