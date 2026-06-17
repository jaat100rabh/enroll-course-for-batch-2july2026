# Google Sheets Integration Setup

Follow these steps to set up Google Sheets for storing form submissions:

## Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Tridiotech Internship Enrollment"

## Step 2: Add Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy the contents of `GoogleAppsScript.js` from this project
4. Paste it into the script editor
5. Save the script (Ctrl+S or Cmd+S)

## Step 3: Deploy as Web App
1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Fill in the details:
   - Description: "Internship Form API"
   - Execute as: **Me** (your email)
   - Who has access: **Anyone** (important!)
4. Click **Deploy**
5. Copy the **Web App URL** (starts with https://script.google.com/...)

## Step 4: Update React App
1. Open `src/components/EnrollmentForm.tsx`
2. Find line 162: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';`
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your Web App URL
4. Save the file

## Step 5: Test
1. Start your React app: `npm run dev`
2. Fill out and submit the form
3. Check your Google Sheet - the data should appear automatically

## Important Notes
- The payment screenshot is converted to base64 but only a confirmation message is stored in the sheet (due to size limits)
- Make sure "Who has access" is set to "Anyone" or the form won't work
- If you need to redeploy the script, you must use a new version number
- The sheet will automatically create headers on first submission

## Troubleshooting
- If form submission fails, check the browser console for errors
- Make sure the Web App URL is correct and accessible
- Verify that the script is deployed with "Anyone" access
