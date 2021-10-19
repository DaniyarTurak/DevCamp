const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
    let error = { ...err }; // spread operator to take all property of err
    error.message = err.message;

    //Log to console for developer
    console.log(err.stack.red);

    //Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource is not found with id of ${err.value}`; // err.value = req.params.id
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key (duplicates err.name is MongoError, but many errors has same name, thats why it is save identify by code)
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    //Mongoose validation errot
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message); //Object.values(obj) example: Array ["somestring", 42, false]
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({ 
        success:false, 
        error: error.message || 'Server Error'
    });

};


module.exports = errorHandler;