const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');
const aiService = require('../services/aiService');
const geoService = require('../services/geoService');

exports.createProject = asyncHandler(async(req, res) => {
    req.body.user = req.user.id;

    // Analyze project with AI
    const aiAnalysis = await aiService.analyzeProject(req.body);
    req.body.aiAnalysis = aiAnalysis;

    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
});

exports.getProjects = asyncHandler(async(req, res) => {
    let query = {...req.query };

    // Advanced filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete query[param]);

    // Geographic search if coordinates provided
    if (req.query.lat && req.query.lng && req.query.radius) {
        const { lat, lng, radius } = req.query;
        query.location = {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius / 6378.1
                ]
            }
        };
    }

    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let queryBuilder = Project.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        queryBuilder = queryBuilder.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryBuilder = queryBuilder.sort(sortBy);
    } else {
        queryBuilder = queryBuilder.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Project.countDocuments(JSON.parse(queryStr));

    queryBuilder = queryBuilder.skip(startIndex).limit(limit);

    const projects = await queryBuilder;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
        success: true,
        count: projects.length,
        pagination,
        data: projects
    });
});