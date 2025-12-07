import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

export const stockNews = createTool({
  id: "Get Stock News",
  inputSchema: z.object({
    symbol: z.string(),
  }),
  description: "Fetches real, live financial news for a stock symbol.",
  execute: async ({ context: { symbol } }) => {
    const apiKey = process.env.FINNHUB_KEY;

    const { data } = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2024-01-01&to=2024-12-31&token=${apiKey}`,
      {
        params: {
          symbol,
          from: "2024-01-01",
          to: "2024-12-31",
          token: apiKey,
        },
      },
    );

    const headlines = data.slice(0, 3).map(item => item.headline);

    return { 
      symbol, 
      headlines,
    };
  },
});
