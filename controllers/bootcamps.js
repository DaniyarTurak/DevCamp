const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    //Copy req.query
    const reqQuery = { ...req.query };
    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //Removing from request
    removeFields.forEach(param => delete reqQuery[param]);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);
    //greater, greater and equal, less ...
    //lte, gt are all mongoose operators, just you need $ operator before to use them
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //Select Fields 
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if (req.query.sort) {
        const sortBy = req.query.select.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // -createdAt = desc createdAt
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1; //convert string to int
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const bootcamp = await query;

    //Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page+1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page-1,
            limit
        }
    }
    //pagination: pagination => pagination
    res.status(200).json({ success: true, count: bootcamp.length, pagination, data: bootcamp });  
    
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id); 
    //formatted id, but db doesnt have it
    if (!bootcamp) { // findbyid иногда возвращает примернно похожую id, поэтому проверяем на null нашу дату
        return next(new ErrorResponse(`Bootcamp is not found with id of ${req.params.id}`, 404));
    } 
    res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp });
    //not formatted id
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp is not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id); // findByIdAndDelete is not trigger by pre()
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp is not found with id of ${req.params.id}`, 404));
    }

    bootcamp.remove(); // in model u can see pre('remove');

    res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp });
});

// @desc Get bootcamps within radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get latitude/langitude from geocoder
    const loc = await geocoder.geocode(zipcode),
          lat = loc[0].latitude;
          lng = loc[0].longitude;
    
    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth radius = 3.963 mi / 
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });

});