const mongoose = require('mongoose');

const OrdersModel = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    customerAge: {
        type: Number,
        required: true
    },
    customerEmailId: {
        type: String,
        required: true
    },
    customerMobileNumber: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    orders: {
        required: false,
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                deliveryCharges: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

const Orders = mongoose.model('Order', OrdersModel);

module.exports = Orders;