/* jshint node:true */
/*jshint esversion: 6 */
const express = require('express');

const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp,
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
// Bring middleware advancedResults
const advancedResults = require('../middleware/advancedResults');


//Include other resource routers
const courseRouter = require('./courses')

const router = express.Router(); // app = expresSs)

const { protect, authorize } = require('../middleware/auth');

//Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect,authorize('publisher', 'admin'), createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect,authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect,authorize('publisher', 'admin'), deleteBootcamp);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);
    
module.exports = router;