import axios from "axios";

const US_STOCKS = ["AAPL", "AMZN", "META", "MO", "MS", "NVDA", "TSLA"];

export const getUSStockPrices = async () => {
  const prices: Record<string, number> = {};

  for (const stock of US_STOCKS) {
    try {
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${stock}`;
      const response = await axios.get(url);
      const data = response.data.quoteResponse.result[0];
      prices[stock] = data.regularMarketPrice;
    } catch (error) {
      console.error(`Error fetching US stock data for ${stock}:`, error);
    }
  }

  return prices;
};
