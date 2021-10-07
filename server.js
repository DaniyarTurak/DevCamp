// npm i express dorenv
// npm run dev
/* jshint node:true */
/*jshint esversion: 6 */
const express = require('express');
const dotenv = require('dotenv');

//Load env values
dotenv.config({ path: './config/confiv.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`));