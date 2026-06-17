// Google Apps Script for Tridiotech Internship Enrollment Form
// Instructions:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Copy this code into the script editor
// 4. Deploy as Web App (Deploy > New deployment > Web app)
// 5. Set "Who has access" to "Anyone"
// 6. Copy the Web App URL and paste it in EnrollmentForm.tsx (line 166)
// 7. IMPORTANT: Replace YOUR_EMAIL below with your actual email address

function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('=== POST REQUEST RECEIVED ===');
    Logger.log('Request: ' + JSON.stringify(e));

    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('ERROR: No postData found');
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No data received' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    Logger.log('Raw data: ' + e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    Logger.log('Parsed data: ' + JSON.stringify(data));

    // Handle payment screenshot - send via email
    let screenshotInfo = 'No screenshot uploaded';
    if (data.paymentScreenshot && data.paymentScreenshot.startsWith('data:image')) {
      try {
        Logger.log('Processing payment screenshot...');

        const base64Data = data.paymentScreenshot;
        const mimeType = base64Data.split(';')[0].split(':')[1];

        // Decode base64 to bytes
        const decoded = Utilities.base64Decode(base64Data.split(',')[1]);

        // Create a blob from the decoded data
        const blob = Utilities.newBlob(decoded, mimeType, `payment_screenshot_${data.fullName.replace(/\s+/g, '_')}.${mimeType.split('/')[1]}`);

        // Send email with screenshot attachment
        // REPLACE 'your-email@example.com' WITH YOUR ACTUAL EMAIL
        const recipientEmail = 'tridiotechno@gmail.com'; // Change this to your email

        const subject = `New Internship Enrollment - ${data.fullName}`;
        const body = `
New Internship Enrollment Received

Student Details:
- Name: ${data.fullName}
- Father's Name: ${data.fathersName}
- Email: ${data.email}
- Mobile: ${data.mobile}
- Date of Birth: ${data.dateOfBirth}

Academic Details:
- College: ${data.collegeName}
- Department: ${data.department}
- Semester: ${data.semester}

Address:
- Address: ${data.address}
- Post: ${data.post}
- City: ${data.city}
- State: ${data.state}
- PIN Code: ${data.pinCode}

Payment Details:
- UTR/Transaction ID: ${data.utr}

Payment screenshot is attached to this email.

Timestamp: ${data.timestamp}
`;

        GmailApp.sendEmail(recipientEmail, subject, body, {
          attachments: [blob]
        });

        screenshotInfo = `Screenshot sent to ${recipientEmail}`;
        Logger.log('Screenshot sent via email: ' + screenshotInfo);
      } catch (emailError) {
        Logger.log('Error sending email: ' + emailError.toString());
        screenshotInfo = 'Email failed: ' + emailError.toString();
      }
    }

    // Check if headers exist, if not create them
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Father\'s Name',
        'Email',
        'Mobile',
        'Date of Birth',
        'College Name',
        'Department',
        'Semester',
        'Address',
        'Post',
        'City',
        'State',
        'PIN Code',
        'UTR/Transaction ID',
        'Payment Screenshot Status'
      ]);
      Logger.log('Headers created');
    }

    // Append new row with form data
    sheet.appendRow([
      data.timestamp || '',
      data.fullName || '',
      data.fathersName || '',
      data.email || '',
      data.mobile || '',
      data.dateOfBirth || '',
      data.collegeName || '',
      data.department || '',
      data.semester || '',
      data.address || '',
      data.post || '',
      data.city || '',
      data.state || '',
      data.pinCode || '',
      data.utr || '',
      screenshotInfo
    ]);

    Logger.log('=== DATA SUCCESSFULLY ADDED TO SHEET ===');

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', screenshotInfo: screenshotInfo }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('=== ERROR IN doPost ===');
    Logger.log('Error: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  Logger.log('=== GET REQUEST RECEIVED ===');
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    const message = lastRow > 1 ? `Sheet has ${lastRow - 1} data rows` : 'Sheet is empty';
    return ContentService.createTextOutput(JSON.stringify({ status: 'active', message: message, totalRows: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
