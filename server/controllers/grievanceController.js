const Grievance = require('../models/Grievance');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');
const notificationService = require('../services/notificationService');
const aiService = require('../services/aiService');

exports.submitGrievance = asyncHandler(async(req, res) => {
    req.body.user = req.user.id;

    // AI analysis for sentiment and urgency
    const aiAnalysis = await aiService.analyzeGrievance(req.body);
    req.body.aiAnalysis = aiAnalysis;

    // Set priority based on AI analysis
    req.body.priority = aiAnalysis.urgencyScore > 0.8 ? 'urgent' :
        aiAnalysis.urgencyScore > 0.6 ? 'high' :
        aiAnalysis.urgencyScore > 0.4 ? 'medium' : 'low';

    const grievance = await Grievance.create(req.body);

    // Notify relevant officials
    await notificationService.notifyOfficials({
        type: 'new_grievance',
        grievance: grievance._id,
        priority: grievance.priority
    });

    res.status(201).json({ success: true, data: grievance });
});

exports.updateGrievance = asyncHandler(async(req, res, next) => {
    let grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
        return next(new ErrorResponse(`Grievance not found with id ${req.params.id}`, 404));
    }

    // Check if SLA is breached
    grievance.checkSLABreach();

    // Add to timeline
    grievance.timeline.push({
        status: req.body.status,
        comment: req.body.comment,
        updatedBy: req.user.id
    });

    // Update fields
    grievance = await Grievance.findByIdAndUpdate(
        req.params.id, {...req.body, timeline: grievance.timeline }, { new: true, runValidators: true }
    );

    // Send notifications based on status change
    if (req.body.status) {
        await notificationService.notifyUser({
            user: grievance.user,
            type: 'grievance_update',
            grievance: grievance._id,
            status: req.body.status
        });
    }

    res.status(200).json({ success: true, data: grievance });
});