//load environment variables early
require('dotenv').config();
const connectDB = require('./config/database');

//Core modules
const express = require('express');
const cors = require('cors');


//middlewares setup
const app = express();
app.use(cors());
app.use(express.json());

//Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'task-manager-api is working' });
});

//database connection
connectDB();

//server port and start
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});