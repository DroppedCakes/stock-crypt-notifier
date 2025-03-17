import { getJPStockPrices } from "./getJPStockPrices";
// import { getUSStockPrices } from "./getUSStockPrices";
// import { getCryptoPrices } from "./getCryptoPrices";
import { calculateChanges, PriceData } from "./calculateChanges";
import { sendDiscordMessage } from "./sendDiscordNotification";
import fs from "fs";

const HISTORY_FILE = "priceHistory.json";

// 過去データを読み込む
const loadHistory = (): PriceData => {
  if (fs.existsSync(HISTORY_FILE)) {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
  }
  return {};
};

// 過去データを保存する
const saveHistory = (history: PriceData) => {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
};

// メイン処理
const main = async () => {
  console.log("Fetching JP stocks, US stocks, and crypto prices...");

  const history = loadHistory();
  const jpStockPrices = await getJPStockPrices();
  // const usStockPrices = await getUSStockPrices();
  // const cryptoPrices = await getCryptoPrices();

  const jpStockMessage = calculateChanges(jpStockPrices, history, "jp_stock");
  // const usStockMessage = calculateChanges(usStockPrices, history, "us_stock");
  // const cryptoMessage = calculateChanges(cryptoPrices, history, "crypto");

  if (jpStockMessage) await sendDiscordMessage(jpStockMessage);
  // if (usStockMessage) await sendDiscordMessage(usStockMessage);
  // if (cryptoMessage) await sendDiscordMessage(cryptoMessage);

  const updateHistory = (
    prices: Record<string, { name: string; price: number }>,
    history: PriceData
  ) => {
    for (const asset in prices) {
      if (!history[asset]) history[asset] = { current: 0, previous: 0, weekly: 0, monthly: 0 };

      history[asset].name = prices[asset].name;
      history[asset].previous = prices[asset].price;
      if (new Date().getDay() === 1) history[asset].weekly = prices[asset].price;
      if (new Date().getDate() === 1) history[asset].monthly = prices[asset].price;
    }
  };

  updateHistory(jpStockPrices, history);
  // updateHistory(usStockPrices, history);
  // updateHistory(cryptoPrices, history);

  saveHistory(history);

  console.log("Done!");
};

// 実行
main();
