import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const headers = [
  "niche", "selectedIdea", "selectedPlatforms", "imageColors",
  "imageAdditionalContent", "instagramContent", "facebookContent",
  "twitterContent", "linkedinContent", "instagramImagePrompt",
  "facebookImagePrompt", "linkedinImagePrompt", "twitterImagePrompt",
  "instagramImageUrl", "facebookImageUrl", "linkedinImageUrl",
  "twitterImageUrl", "status",
];

const sampleRow = [
  "Technology",                                        // niche
  "Top 5 AI tools reshaping work in 2025",            // selectedIdea
  "Instagram, Facebook, Twitter, LinkedIn",            // selectedPlatforms
  "Blue, White, Dark Gray",                            // imageColors
  "Minimalist tech aesthetic with futuristic feel",   // imageAdditionalContent
  "🚀 AI is changing the game! Here are 5 tools you need in 2025. #AI #Tech #Innovation",  // instagramContent
  "Artificial Intelligence is revolutionizing the workplace. Discover the top 5 tools every professional needs. #AI #FutureOfWork",  // facebookContent
  "5 AI tools reshaping work in 2025 🧵 #AI #Tech",  // twitterContent
  "The future of work is AI-powered. Here are the 5 tools leading the charge in 2025. #AI #LinkedIn #ProfessionalGrowth",  // linkedinContent
  "Futuristic tech workspace with glowing AI interfaces, blue tones",  // instagramImagePrompt
  "Professional office with AI holographic displays, clean modern design",  // facebookImagePrompt
  "Minimalist AI tech concept art, dark background with blue accents",  // linkedinImagePrompt
  "Bold AI technology graphic, high contrast, social media optimized",  // twitterImagePrompt
  "https://res.cloudinary.com/sample/image/instagram.jpg",  // instagramImageUrl
  "https://res.cloudinary.com/sample/image/facebook.jpg",   // facebookImageUrl
  "https://res.cloudinary.com/sample/image/linkedin.jpg",   // linkedinImageUrl
  "https://res.cloudinary.com/sample/image/twitter.jpg",    // twitterImageUrl
  "draft",                                             // status
];

async function runTest() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Step 0: Get the actual sheet name
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
  });
  const sheetName = meta.data.sheets[0].properties.title;
  console.log(`📋 Detected sheet tab name: "${sheetName}"`);

  const range = `${sheetName}!A1`;

  // Step 1: Write headers to Row 1
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [headers] },
  });
  console.log("✅ Headers written to Row 1");

  // Step 2: Append sample data row
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [sampleRow] },
  });
  console.log("✅ Sample data row appended successfully!");
  console.log("\n📊 Check your sheet at:");
  console.log("https://docs.google.com/spreadsheets/d/" + process.env.GOOGLE_SHEET_ID + "/edit");
}

runTest().catch(console.error);

