export type Currency = "EUR" | "USD";
export type Rates = { [key: string]: { [key: string]: number } };

// @ts-ignore
let rates: Rates = {};

function getCurrencyName(c: string): Currency {
  if (c === "$" || c === "usd") {
    return "USD";
  } else if (c === "€" || c === "eur") {
    return "EUR";
  }
  return "EUR";
}

export function convertCurrency(
  amount: number,
  cInput: string,
  cOutput: string
) {
  const cInputName = getCurrencyName(cInput);
  const cOutputName = getCurrencyName(cOutput);

  const rate = rates?.[cInputName]?.[cOutputName];
  if (rate) {
    const result = amount * rate;
    return `${Math.round(result * 100) / 100} ${cOutput}`;
  }
  return "";
}

export function setCurrenciesRates(r: Rates) {
  rates = r;
}
