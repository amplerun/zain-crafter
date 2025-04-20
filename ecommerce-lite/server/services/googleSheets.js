const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

const auth = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

exports.updateGoogleSheet = async (sheetName, rowData) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    
    // Get current date in YYYY-MM-DD format
    const date = new Date().toISOString().split('T')[0];
    
    // Append the date to the row data
    const values = [rowData.concat(date)];
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
};

exports.getSheetData = async (sheetName) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });
    
    return response.data.values || [];
  } catch (error) {
    console.error('Error reading Google Sheet:', error);
    throw error;
  }
};
