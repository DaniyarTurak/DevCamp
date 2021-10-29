const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if(req.params.bootcampId) { // for specific
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else { // for all courses
        query = Course.find().populate({ // additional info, besides id
            path: 'bootcamp',
            select: 'name description' //name and descrption
        });
    }
    const courses = await query;

    res.status(200).json({ 
        success:true, count: courses.length, data: courses 
    });
    
});