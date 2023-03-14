//https://api.apilayer.com/fixer/latest?base=USD&symbols=EUR,GBP

import axios from "axios";

async function getRates(base: string) {
  const url = `${
    process.env.FIXER_API_URL
  }/latest?base=${base}`;

  const result = await axios.get(url, {
    headers: {
      apikey: process.env.FIXER_API_KEY,
    },
  });
  console.log(result);
  return result.data;
}


export default {
    getRates,
}