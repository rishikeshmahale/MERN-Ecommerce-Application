const express = require('express');
const router = express.Router();

const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController.js');

const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');


router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;