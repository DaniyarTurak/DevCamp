// npm i express dorenv; npm run dev; npm i morgan
/* jshint node:true */
/*jshint esversion: 6 */
const express = require('express');
const dotenv = require('dotenv'); // нужен для доступа к .env датам
//const logger = require('./middleware/logger')
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDb = require('./config/db');
//Load env values
dotenv.config({ path: './config/config.env' });

//Connect to db
connectDb();

//Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body parser
app.use(express.json());

// app.use(logger);
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routess
app.use('/api/v1/bootcamps', bootcamps);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow.bold)
);

//Handle unhandled rejection of promises
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit process
    server.close(() => process.exit(1)); // 1- meand exit with faillure
});