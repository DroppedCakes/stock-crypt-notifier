export type PriceData = {
    [symbol: string]: {
      name?: string;
      current: number;
      previous: number;
      weekly: number;
      monthly: number;
    };
  };
  
  export const calculateChanges = (
    prices: Record<string, { name: string; price: number }>,
    history: PriceData,
    type: "jp_stock" | "us_stock" | "crypto"
  ): string => {
    let message = "";
  
    for (const asset in prices) {
      const { name, price: currentPrice } = prices[asset];
      const prevPrice = history[asset]?.previous || currentPrice;
      const weeklyPrice = history[asset]?.weekly || currentPrice;
      const monthlyPrice = history[asset]?.monthly || currentPrice;
  
      const dailyChange = ((currentPrice - prevPrice) / prevPrice) * 100;
      const weeklyChange = ((currentPrice - weeklyPrice) / weeklyPrice) * 100;
      const monthlyChange = ((currentPrice - monthlyPrice) / monthlyPrice) * 100;
  
      const emoji =
        type === "crypto" ? ":robot:" : type === "us_stock" ? ":flag_us:" : "📈";
      const color = dailyChange >= 0 ? ":green_circle:" : ":red_circle:";
      
      const displayName = name || asset; // shortNameがない場合はティッカーシンボルを表示
  
      message += `${emoji} ${displayName} / ${currentPrice} ${color} / 前日比${dailyChange.toFixed(2)}% / 先週比${weeklyChange.toFixed(2)}% / 先月比${monthlyChange.toFixed(2)}%\n`;
    }
  
    return message;
  };
  