/* jshint node:true */
/*jshint esversion: 6 */
const express = require('express');

const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp,
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps');


//Include other resource routers
const courseRouter = require('./courses')

const router = express.Router(); // app = expresSs)

//Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);
    
module.exports = router;