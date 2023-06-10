const { mongoose } = require('mongoose');
const OrderModel = require('../models/OrdersModel')

// Creating Orders

const createOrder = async (req, res) => {
    const { id } = req.body;
    try {
        if (id) {
            const result = await OrderModel.findById({ _id: id }).exec();

            if (result) {

                const order = {
                    name: req.body.name,
                    price: req.body.price,
                    deliveryCharges: req.body.deliveryCharges
                }

                result.orders.push(order);

                const updatedResult = await OrderModel.findByIdAndUpdate(id, result, { new: true }).exec();

                if (updatedResult) {
                    res.status(200).json(updatedResult);
                }

            }
        } else {
            const result = await OrderModel.create(req.body);

            if (result) {
                res.status(201).json(result)
            }
        }
    } catch (err) {
        console.error(`Something Went Wrong :: ${err.message}`);
        res.status(500).json({ 'error': 'Something Went Wrong' })
    }
}


// Fetch Order By Id

const fetchOrderById = async (req, res) => {
    const id = req.params.orderId;

    try {
        const result = await OrderModel.find({ 'orders._id': id }).exec();

        if (result) {
            const updatedResult = result.map(item => {
                const record = { ...item };
                console.log(record);
                const filteredOrders = item.orders.filter(orderItem => {
                    if (orderItem['_id'].toString() === id) return orderItem;
                })

                item.orders = filteredOrders;

                return item;
            });

            res.status(200).json(updatedResult)
        }

    } catch (err) {
        console.error(`Something Went Wrong :: ${err.message}`);
        res.status(500).json({ 'error': `Something Went Wrong ${err.message}` })
    }
}

// Fetch Customer Orders List By Key Search

const fetchOrdersListByKey = async (req, res) => {
    const cutomerId = req.params.customerId;
    try {
        const customerRecord = await OrderModel.findById(cutomerId).exec();

        const keyword = req.query.orderKey;
        let price = req.query.price;

        if (customerRecord) {
            if (keyword) {
                const filteredOrders = customerRecord.orders.filter(order => {
                    if (order.name.toLowerCase().includes(keyword.toLowerCase())) {
                        return order;
                    }
                })

                customerRecord.orders = filteredOrders;

                res.status(200).json(customerRecord);
            } else if (price) {
                price = Number(price);

                const filteredOrders = customerRecord.orders.filter(order => {
                    if (order.price >= price) return order;
                })

                customerRecord.orders = filteredOrders;

                res.status(200).json(customerRecord);
            }
        }
    } catch (err) {
        console.error(`Something Went Wrong :: ${err.message}`);
        res.status(500).json({ 'error': `Something Went Wrong ${err.message}` })
    }
};

// Fetch All Orders

const fetchAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({}).exec();

        if (orders) {
            res.status(200).json(orders);
        }
    } catch (err) {
        console.error(`Something Went Wrong :: ${err.message}`);
        res.status(500).json({ 'error': `Something Went Wrong ${err.message}` })
    }
};

// Fetch All Customers with Specific food item name

const fetchCustomersByFoodItem = async (req, res) => {
    const itemName = req.query.orderItemName;

    try {
        if (itemName) {
            const customersList = await OrderModel.find({ 'orders.name': { '$regex': itemName, '$options': 'i' } }).exec();

            // Traditional Filtering

            customersList.forEach(customer => {
                const filteredOrders = customer.orders.filter(order => {
                    if (order.name.toLowerCase().includes(itemName.toLowerCase())) {
                        return order;
                    }
                });

                customer.orders = filteredOrders;
            });

            if (customersList) {
                res.status(200).json(customersList)
            }
        }
    } catch (err) {
        console.error(`Something Went Wrong :: ${err.message}`);
        res.status(500).json({ 'error': `Something Went Wrong ${err.message}` })
    }
};

module.exports = {
    createOrder,
    fetchOrderById,
    fetchOrdersListByKey,
    fetchAllOrders,
    fetchCustomersByFoodItem
}