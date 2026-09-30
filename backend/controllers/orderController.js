const Order = require('../model/Order.js');
const sendEmail = require('../utils/SendEmail.js');


// create an order for users
const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;

    if (!items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        userId: req.user._id,
        items,
        totalAmount,
        address,
        paymentId
      });

      const createdOrder = await order.save();

      // Send Order Confirmation Email
      const message = `
        <h2>Order Confirmation</h2>
        <p>Hello ${req.user.name},</p>
        <p>Your order has been successfully placed! Order ID: <strong>${createdOrder._id}</strong></p>
        <p>Total Amount Paid: $${totalAmount.toFixed(2)}</p>
        <p>It will be shipped to: ${address.street}, ${address.city}</p>
        <p>Thank you for shopping with ShopNest!</p>
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'ShopNest - Order Confirmation',
        message
      });

      return res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get specific user's order 
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });

    if(!orders){
        return res.status(404).json({message : "No orders found"});
    }

    return res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get all orders for admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name');

    if(!orders){
        return res.status(404).json({message : "No orders found"});
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };