//load environment variables early
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');

//Core modules
const express = require('express');
const cors = require('cors');

//Routes
const authRoutes = require('./routes/auth.routes');

//Error handler
const { errorHandler, notFound } = require('./middlewares/errorHandler');


//middlewares setup
const app = express();
app.use(cors());
app.use(express.json());

//Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'task-manager-api is working' });
});

//API routes
app.use('/api/auth', authRoutes);

//Error handling middlewares
app.use(notFound);
app.use(errorHandler);

//database connection
connectDB();

//server port and start
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});