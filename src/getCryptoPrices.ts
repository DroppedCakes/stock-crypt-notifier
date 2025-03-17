import axios from "axios";

const COINS = ["bitcoin", "ethereum", "ripple"];

export const getCryptoPrices = async () => {
  const prices: Record<string, number> = {};

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(
      ","
    )}&vs_currencies=jpy`;
    const response = await axios.get(url);

    for (const coin of COINS) {
      prices[coin.toUpperCase()] = response.data[coin].jpy;
    }
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
  }

  return prices;
};
