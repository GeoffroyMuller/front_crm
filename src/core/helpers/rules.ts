export type Rule = (val: any) => string | boolean | null | undefined;
export type Rules = Array<Rule>;
export type NamedRules = { [key: string]: [Rule] | Rule };

export function required(): Rule {
  return (val: any) => (val != null ? true : "La valeur est requise");
}

export default {
  required,
};
