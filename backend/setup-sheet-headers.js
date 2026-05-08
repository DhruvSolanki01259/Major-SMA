import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const headers = [
  "id",
  "niche",
  "selectedIdea",
  "selectedPlatforms",
  "imageColors",
  "imageAdditionalContent",
  "instagramContent",
  "facebookContent",
  "twitterContent",
  "linkedinContent",
  "instagramImagePrompt",
  "facebookImagePrompt",
  "linkedinImagePrompt",
  "twitterImagePrompt",
  "instagramImageUrl",
  "facebookImageUrl",
  "linkedinImageUrl",
  "twitterImageUrl",
  "status",
];

async function setupHeaders() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [headers],
    },
  });

  console.log("✅ Headers written to Google Sheet Row 1 successfully!");
}

setupHeaders().catch(console.error);
