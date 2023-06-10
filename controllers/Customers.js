const CustomerModel = require('../models/CustomerModel');

// Register Customer
const registerCustomer = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            middleName,
            age,
            emailId,
            countryCode,
            mobileNumber,
            state,
            pincode,
            country,
            addr
        } = req.body;

        if (middleName) {
            const customerRequest = {
                firstName,
                middleName,
                lastName,
                age,
                emailId,
                mobile: {
                    countryCode,
                    mobileNumber
                },
                address: {
                    state,
                    pincode,
                    country,
                    addr
                }
            };

            const result = await CustomerModel.create(customerRequest);

            if (result) {
                res.status(201).json(result);
            }
        } else {
            const customerRequest = {
                firstName,
                lastName,
                age,
                emailId,
                mobile: {
                    countryCode,
                    mobileNumber
                },
                address: {
                    state,
                    pincode,
                    country,
                    addr
                }
            };

            const result = await CustomerModel.create(customerRequest);

            if (result) {
                res.status(201).json(result);
            }
        }
    } catch (err) {
        console.error(`Something Went Wrong :: ${err.message}`);
        res.status(500).json({ 'error': `Something Went Wrong`, msg: err.message })
    }
}


// Fetch All Customer Records

const fetchAllCustomerRecords = async (req, res) => {
    try {
        const result = await CustomerModel.find({}, { __v: 0, _id: 0, 'mobile._id': 0 }).sort({ firstName: -1, lastName: -1, "address.state": -1 }).exec();

        if (result) {
            res.status(200).json(result);
        }
    } catch (err) {
        console.error(`Something Went Wrong :: ${err.message}`);
        res.status(500).json({ 'error': `Something Went Wrong`, msg: err.message })
    }
}
module.exports = {
    registerCustomer,
    fetchAllCustomerRecords
}