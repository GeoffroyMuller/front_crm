export type Rule = (val: string) => string | boolean | null | undefined;
export type Rules = Array<Rule>;
export type NamedRules = { [key: string]: [Rule] | Rule };

export function required(): Rule {
  return (val: string) => (val ? false : "La valeur est requise");
}

export function valEqual(toBeEqual: string): Rule {
  return (val: string) => {
    return val === toBeEqual
      ? false
      : `La valeur doit etre egale à "${toBeEqual}"`;
  };
}
