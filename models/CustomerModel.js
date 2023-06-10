const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    },
    age: {
        type: Number,
        required: true,
        min: 12,
        max: 95
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true
    },
    mobile: {
        type: {
            countryCode: {
                type: String,
                required: true
            },
            mobileNumber: {
                type: String,
                required: true
            }
        },
        required: true
    },

    address: {
        type: {
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            addr: {
                type: String,
                required: true
            },
        },
        required: true
    }
})

const CustomerModel = mongoose.model('Customer', CustomerSchema);

module.exports = CustomerModel;