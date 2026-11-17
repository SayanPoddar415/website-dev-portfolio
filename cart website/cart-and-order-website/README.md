# Cart And Order — One-page website

A responsive HTML, CSS, and JavaScript website based on the supplied reference image and PRD.

## Files
- `index.html` — page markup and metadata
- `styles.css` — responsive design and layout
- `script.js` — mobile navigation, form validation, character count, and form submission
- `google-apps-script.gs` — Google Apps Script endpoint to save inquiries to Google Sheets
- `privacy-policy.html` and `terms-of-service.html` — starter legal pages (review before publishing)
- `robots.txt` and `sitemap.xml` — SEO configuration (replace example domain)

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a browser, or serve the folder with a local static server:
   - Python: `python -m http.server 8000`
   - Visit `http://localhost:8000`
3. Replace the placeholder app and social profile URLs before launch.

## Connect the inquiry form to Google Sheets
1. Create a Google Sheet and name the first tab `Inquiries`.
2. In Google Sheets, open **Extensions → Apps Script**.
3. Copy `google-apps-script.gs` into the Apps Script editor.
4. Save the script. Run `setupSheet` once and approve the requested Google permissions.
5. Deploy **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (or the access level appropriate to your business; public inquiry forms need an accessible endpoint)
6. Copy the deployed Web App URL.
7. Paste it into `GOOGLE_APPS_SCRIPT_URL` in `script.js`.
8. Submit a test inquiry and verify a row appears in the sheet.

### Important form behavior
The frontend uses `fetch(..., mode: "no-cors")` to dispatch a form submission to Apps Script. Browsers do not expose the response in no-cors mode, so the page cannot reliably confirm that Apps Script saved the row. For a stronger production implementation, use a backend/proxy or configure a CORS-enabled endpoint and return a verifiable JSON response. Add spam protection (e.g., reCAPTCHA or server-side rate limiting) before public launch.

## Before production
- Replace `https://www.example.com/` with your real domain in canonical/OG/schema/sitemap.
- Replace social links with official Cart And Order profile URLs.
- Replace the Download App placeholder with the real Play Store or app download URL.
- Review the starter Privacy Policy and Terms of Service with appropriate legal advice.
- Use HTTPS and test the form, navigation, mobile breakpoints, and keyboard accessibility.
- The photos use remote Unsplash image URLs; download/host licensed assets locally if you need guaranteed availability and control.
