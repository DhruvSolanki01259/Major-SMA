import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use FREE tier model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default model;
