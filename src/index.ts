import { getJPStockPrices } from "./getJPStockPrices";
import { getUSStockPrices } from "./getUSStockPrices";
import { getcryptoPrices } from "./getcryptoPrices";
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
  console.log("Fetching stock, US stock, and cryptoo prices...");

  const history = loadHistory();
  const jpStockPrices = await getJPStockPrices();
//   const usStockPrices = await getUSStockPrices();
//   const cryptooPrices = await getcryptooPrices();

  const stockMessage = calculateChanges(jpStockPrices, history, "jp_stock");
//   const usStockMessage = calculateChanges(usStockPrices, history, "us_stock");
//   const cryptooMessage = calculateChanges(cryptooPrices, history, "cryptoo");

  if (stockMessage) await sendDiscordMessage(stockMessage);
//   if (usStockMessage) await sendDiscordMessage(usStockMessage);
//   if (cryptooMessage) await sendDiscordMessage(cryptooMessage);

  const updateHistory = (prices: Record<string, number>, history: PriceData) => {
    for (const asset in prices) {
      if (!history[asset]) history[asset] = { current: 0, previous: 0, weekly: 0, monthly: 0 };

      history[asset].previous = prices[asset];
      if (new Date().getDay() === 1) history[asset].weekly = prices[asset];
      if (new Date().getDate() === 1) history[asset].monthly = prices[asset];
    }
  };

  updateHistory(jpStockPrices, history);
//   updateHistory(usStockPrices, history);
//   updateHistory(cryptooPrices, history);

  saveHistory(history);

  console.log("Done!");
};

// 実行
main();
