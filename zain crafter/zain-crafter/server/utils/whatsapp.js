const axios = require('axios');

/**
 * Send WhatsApp notification using 360Dialog API
 * @param {Object} options - Notification options
 * @param {string} options.to - Recipient phone number (with country code)
 * @param {string} options.type - Notification type (new-order, order-confirmation, order-status-update)
 * @param {Object} options.data - Data to include in the notification
 * @returns {Promise} - Promise resolving to notification send result
 */
exports.sendWhatsAppNotification = async (options) => {
  try {
    const { to, type, data } = options;
    
    // Validate API key
    const apiKey = process.env.DIALOG360_API_KEY;
    if (!apiKey) {
      throw new Error('360Dialog API key not configured');
    }
    
    // Normalize phone number (remove '+' if present)
    const phone = to.startsWith('+') ? to.substring(1) : to;
    
    // Create message based on notification type
    let messageData;
    
    switch (type) {
      case 'new-order':
        messageData = createNewOrderMessage(data.order, data.user);
        break;
      case 'order-confirmation':
        messageData = createOrderConfirmationMessage(data.order);
        break;
      case 'order-status-update':
        messageData = createOrderStatusUpdateMessage(data.order);
        break;
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
    
    // Send message via 360Dialog API
    const response = await axios.post(
      'https://waba.360dialog.io/v1/messages',
      messageData,
      {
        headers: {
          'D360-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    throw error;
  }
};

/**
 * Create message payload for new order notification to seller
 * @param {Object} order - Order object
 * @param {Object} user - User object
 * @returns {Object} - Message payload
 */
const createNewOrderMessage = (order, user) => {
  // Format order items
  const items = order.items.map(
    item => `• ${item.name} (${item.quantity} × ${item.price})`
  ).join('\n');
  
  // Format total
  const total = order.totalPrice.toFixed(2);
  
  // Format shipping address
  const address = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;
  
  const templateName = 'new_order_notification';
  
  return {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: order._id.toString()
            },
            {
              type: 'text',
              text: user.name
            },
            {
              type: 'text',
              text: items
            },
            {
              type: 'text',
              text: total
            },
            {
              type: 'text', 
              text: address
            },
            {
              type: 'text',
              text: order.shippingAddress.phone || 'Not provided'
            }
          ]
        }
      ]
    }
  };
};

/**
 * Create message payload for order confirmation to customer
 * @param {Object} order - Order object
 * @returns {Object} - Message payload
 */
const createOrderConfirmationMessage = (order) => {
  // Format order items
  const items = order.items.map(
    item => `• ${item.name} (${item.quantity} × ${item.price})`
  ).join('\n');
  
  // Format total
  const total = order.totalPrice.toFixed(2);
  
  const templateName = 'order_confirmation';
  
  return {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: order._id.toString()
            },
            {
              type: 'text',
              text: items
            },
            {
              type: 'text',
              text: total
            }
          ]
        }
      ]
    }
  };
};

/**
 * Create message payload for order status update to customer
 * @param {Object} order - Order object
 * @returns {Object} - Message payload
 */
const createOrderStatusUpdateMessage = (order) => {
  const templateName = 'order_status_update';
  
  return {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: order._id.toString()
            },
            {
              type: 'text',
              text: order.status
            },
            {
              type: 'text',
              text: order.trackingNumber || 'Not available yet'
            }
          ]
        }
      ]
    }
  };
};