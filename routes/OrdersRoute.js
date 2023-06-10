const express = require('express');
const router = express.Router();
const { createOrder, fetchOrderById, fetchOrdersListByKey, fetchAllOrders, fetchCustomersByFoodItem } = require('../controllers/Orders')

router.get('/', fetchAllOrders);
router.get('/fetchCustomers', fetchCustomersByFoodItem)
router.get('/booked/:orderId', fetchOrderById);
router.get('/ordersearch/:customerId', fetchOrdersListByKey);
router.post('/', createOrder);


module.exports = router;