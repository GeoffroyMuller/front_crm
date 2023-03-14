export async function fetchCurrenciesRates() {
  const url = `${import.meta.env.VITE_API_URL}/currencies/rates`;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}
