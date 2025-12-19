const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractTextFromResume(filePath, fileType) {
  try {
    let raw = "";
    if (fileType === "application/pdf" || filePath.toLowerCase().endsWith(".pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdfParse(dataBuffer);
      raw = parsed.text || "";
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      filePath.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      raw = result.value || "";
    } else {
      return "";
    }
    const normalized = raw
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    return normalized;
  } catch (err) {
    return "";
  }
}

module.exports = { extractTextFromResume };

