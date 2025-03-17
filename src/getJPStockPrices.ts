import yahooFinance from "yahoo-finance2";

const JP_STOCKS = ["6758.T", "6501.T", "7203.T"]; // ソニー、日立、トヨタ

export type JPStockInfo = {
  name: string;
  price: number;
};

export const getJPStockPrices = async () => {
  const prices: Record<string, JPStockInfo> = {};

  for (const stock of JP_STOCKS) {
    try {
      const result = await yahooFinance.quote(stock);
      if (result && result.regularMarketPrice && result.shortName) {
        prices[stock] = {
          name: result.shortName,
          price: result.regularMarketPrice,
        };
      }
    } catch (error) {
      console.error(`Error fetching JP stock data for ${stock}:`, error);
    }
  }

  return prices;
};
