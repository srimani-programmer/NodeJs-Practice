const express = require('express');
const router = express.Router();

const { registerCustomer, fetchAllCustomerRecords } = require('../controllers/Customers');

router.post('/register', registerCustomer)
router.get('/fetchallcustomers', fetchAllCustomerRecords)

module.exports = router;