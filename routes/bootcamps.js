/* jshint node:true */
/*jshint esversion: 6 */
const express = require('express');

const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp,
    updateBootcamp, 
    deleteBootcamp 
} = require('../controllers/bootcamps');

const router = express.Router(); // app = expresSs)

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

    
module.exports = router;