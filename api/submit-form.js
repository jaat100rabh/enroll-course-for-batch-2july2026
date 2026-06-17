// Vercel API route to proxy form submissions to Google Apps Script
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxaLSQvHbHmZ7XheTA-HVFMVyh31NrUl7RhMSYnmOCd2jNvAO8UcGGeyhm2hx15FYdcYA/exec';

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Since no-cors mode returns opaque response, we assume success if no error
    return res.status(200).json({ status: 'success', message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
