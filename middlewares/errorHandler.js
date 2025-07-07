// Middleware to handle errors
const errorHandler = (err, req, res, next ) => {
    console.error(err.stack);

    // Set the status code to 500 if it's not already set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

// Middleware to handle 404 Not Found errors
const notFound = (req, res, next) => {
    res.status(404);
    next(new Error(`Not Found - ${req.originalUrl}`));
}

module.exports = { errorHandler, notFound }