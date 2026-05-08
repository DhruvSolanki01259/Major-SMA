import { google } from "googleapis";

/**
 * Appends a post record to the configured Google Sheet.
 *
 * Expected environment variables:
 *   GOOGLE_SHEET_ID          – the spreadsheet ID from the sheet URL
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL – service account email
 *   GOOGLE_PRIVATE_KEY        – service account private key (with \n escaped)
 *
 * Sheet columns (row 1 must contain these headers):
 *   id | niche | selectedIdea | selectedPlatforms | imageColors |
 *   imageAdditionalContent | instagramContent | facebookContent |
 *   twitterContent | linkedinContent | instagramImagePrompt |
 *   facebookImagePrompt | linkedinImagePrompt | twitterImagePrompt |
 *   instagramImageUrl | facebookImageUrl | linkedinImageUrl |
 *   twitterImageUrl | status
 */
export const appendPostToSheet = async (postData) => {
  try {
    const {
      postId,
      niche,
      selectedIdea,
      selectedPlatforms,
      creative,
      platforms,
      status,
    } = postData;

    // ── helpers ──────────────────────────────────────────────────────────────
    const platformContent = (key) => {
      const p = platforms?.[key];
      if (!p) return "";
      const text = p.content?.text || "";
      const tags = (p.content?.hashtags || []).join(" ");
      return tags ? `${text} ${tags}`.trim() : text;
    };

    const imagePrompt = (key) => platforms?.[key]?.imagePrompt || "";
    const mediaUrl = (key) => platforms?.[key]?.mediaUrl || "";

    // ── row values (must match header order exactly) ──────────────────────────
    const row = [
      postId ? String(postId) : "",   // id
      niche || "",
      selectedIdea || "",
      Array.isArray(selectedPlatforms) ? selectedPlatforms.join(", ") : (selectedPlatforms || ""),
      Array.isArray(creative?.imageColors) ? creative.imageColors.join(", ") : (creative?.imageColors || ""),
      creative?.imageNotes || "",       // imageAdditionalContent
      platformContent("instagram"),
      platformContent("facebook"),
      platformContent("twitter"),
      platformContent("linkedin"),
      imagePrompt("instagram"),
      imagePrompt("facebook"),
      imagePrompt("linkedin"),
      imagePrompt("twitter"),
      mediaUrl("instagram"),
      mediaUrl("facebook"),
      mediaUrl("linkedin"),
      mediaUrl("twitter"),
      status || "draft",
    ];

    // ── auth ─────────────────────────────────────────────────────────────────
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Auto-detect first sheet tab name (handles any tab name)
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    const sheetName = meta.data.sheets[0].properties.title;

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    console.log("✅ Post appended to Google Sheets successfully.");
  } catch (error) {
    // Non-fatal – log but don't throw so MongoDB save still succeeds
    console.error("❌ Failed to append post to Google Sheets:", error.message);
  }
};
