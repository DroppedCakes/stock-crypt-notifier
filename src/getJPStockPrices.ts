import yahooFinance from "yahoo-finance2";

const STOCKS = ["6758.T"]; // ソニー、日立、トヨタ

export const getJPStockPrices = async () => {
  const prices: Record<string, number> = {};

  for (const stock of STOCKS) {
    try {
      const result = await yahooFinance.quote(stock);
      if (result && result.regularMarketPrice) {
        prices[stock] = result.regularMarketPrice;
      }
    } catch (error) {
      console.error(`Error fetching stock data for ${stock}:`, error);
    }
  }

  return prices;
};
