import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", // Optional, for including your app on openrouter.ai rankings.
    "X-Title": "Content Studio", // Optional. Shows in rankings on openrouter.ai.
  }
});

export default openai;
