const axios = require('axios');

const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await axios.post(
      'https://waba.360dialog.io/v1/messages',
      {
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'D360-API-KEY': process.env.WHATSAPP_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
};

exports.sendOrderConfirmation = async (order) => {
  if (!process.env.WHATSAPP_NOTIFICATIONS || process.env.WHATSAPP_NOTIFICATIONS === 'true') {
    const message = `Thank you for your order!\n\nOrder #${order._id}\nItems:\n${order.orderItems.map(item => `- ${item.name} (Qty: ${item.quantity})`).join('\n')}\nTotal: ${order.currencySymbol || '$'}${order.totalPrice}\n\nWe'll notify you when your order ships.`;
    await sendWhatsAppMessage(order.customer.phone, message);
  }
};

exports.notifySeller = async (order) => {
  if (!process.env.WHATSAPP_NOTIFICATIONS || process.env.WHATSAPP_NOTIFICATIONS === 'true') {
    const message = `New Order Received!\n\nOrder #${order._id}\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nAddress: ${order.shippingAddress}\n\nItems:\n${order.orderItems.map(item => `- ${item.name} (Qty: ${item.quantity})`).join('\n')}\nTotal: ${order.currencySymbol || '$'}${order.totalPrice}`;
    await sendWhatsAppMessage(process.env.WHATSAPP_SELLER_NUMBER, message);
  }
};
