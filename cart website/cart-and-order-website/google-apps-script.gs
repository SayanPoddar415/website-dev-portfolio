/**
 * Cart And Order — Google Apps Script endpoint
 * Saves business inquiries to a Google Sheet.
 *
 * Setup:
 * 1. Create a Google Sheet and set SHEET_ID below.
 * 2. Run setupSheet() once from the Apps Script editor.
 * 3. Deploy as a Web App (execute as you; access setting appropriate to your form).
 */

const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Inquiries";

function setupSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Full Name", "Phone or Email", "Role",
      "Business Name", "Inquiry", "Consent"
    ]);
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const fullName = clean(params.fullName, 100);
    const contactInfo = clean(params.contactInfo, 120);
    const role = clean(params.role, 20);
    const businessName = clean(params.businessName, 120);
    const inquiry = clean(params.inquiry, 500);
    const consent = params.consent === "true";

    if (!fullName || !contactInfo || !inquiry || !consent) {
      return jsonResponse({ success: false, message: "Missing required fields." });
    }
    if (role !== "Buyer" && role !== "Seller") {
      return jsonResponse({ success: false, message: "Invalid role." });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet not found. Run setupSheet() first.");

    sheet.appendRow([
      new Date(),
      safeCell(fullName),
      safeCell(contactInfo),
      role,
      safeCell(businessName),
      safeCell(inquiry),
      consent ? "Yes" : "No"
    ]);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, message: "Unable to save inquiry." });
  }
}

// Trim values and cap length to reduce accidental oversized input.
function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

// Prevent spreadsheet formula injection from user-submitted values.
function safeCell(value) {
  const text = String(value || "");
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
