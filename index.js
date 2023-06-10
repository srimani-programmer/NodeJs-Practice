// Importing the Config Module
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Importing DB utils
const connectDB = require('./config/dbUtil');

// Importing Routes

const orderRoute = require('./routes/OrdersRoute');
const customerRoute = require('./routes/CustomerRoute');
const courseRoute = require('./routes/CourseRoute');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Connecting to Database
connectDB();

app.use(express.json());

app.use('/api/v1/orders', orderRoute)
app.use('/api/v1/customer', customerRoute)
app.use('/api/v1', courseRoute)

try {
    mongoose.connection.once('open', () => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening to the port :: ${process.env.PORT}`);
        })
    })
} catch (err) {
    console.error(`Something Wrong with DB Connection :: ${err.message}`);
}

