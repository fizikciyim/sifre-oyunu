import { Rule } from "../rules";

export type Level = {
  id: number;
  rules: Rule[];
  conditionalRules?: Rule[];
};
