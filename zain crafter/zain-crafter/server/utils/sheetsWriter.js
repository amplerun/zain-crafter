const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Create Google Sheets client
const createSheetsClient = async () => {
  try {
    // Get credentials from environment or file
    let credentials;
    
    if (process.env.GOOGLE_CREDENTIALS) {
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
      const credentialsPath = path.join(__dirname, '../config/google-credentials.json');
      if (fs.existsSync(credentialsPath)) {
        credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      } else {
        throw new Error('Google credentials not found');
      }
    }
    
    const { client_email, private_key } = credentials;
    
    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error creating Google Sheets client:', error);
    throw error;
  }
};

/**
 * Update Google Sheet with order data
 * @param {Object} order - Order object
 * @param {Object} user - User object
 * @returns {Promise} - Promise resolving to sheet update result
 */
exports.updateGoogleSheet = async (order, user) => {
  try {
    const sheets = await createSheetsClient();
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!sheetId) {
      throw new Error('Google Sheet ID not configured');
    }
    
    // Prepare sheet data
    const orderDate = new Date(order.createdAt).toLocaleString();
    const items = order.items.map(item => `${item.name} (${item.quantity} × ${item.price})`).join(', ');
    const shippingAddress = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;
    
    // Append row to sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Orders!A:J',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [
            order._id.toString(),
            orderDate,
            user.name,
            user.email || '',
            order.shippingAddress.phone || '',
            items,
            order.totalPrice,
            order.paymentMethod,
            shippingAddress,
            order.status
          ],
        ],
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
};