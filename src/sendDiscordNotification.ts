import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

export const sendDiscordMessage = async (message: string) => {
  try {
    await axios.post(DISCORD_WEBHOOK_URL, { content: message });
    console.log("Message sent to Discord");
  } catch (error) {
    console.error("Error sending message to Discord:", error);
  }
};
