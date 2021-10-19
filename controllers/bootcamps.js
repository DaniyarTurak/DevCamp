const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.find();
    res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp });  
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
exports.createBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp is not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp });
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp is not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp });
};