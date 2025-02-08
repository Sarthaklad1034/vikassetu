// validation.js
const Joi = require('joi');

const validationSchemas = {
    user: {
        registration: Joi.object({
            name: Joi.string().min(3).max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                }),
            role: Joi.string().valid('villager', 'panchayat_official', 'admin').required(),
            village: Joi.string().required(),
            phone: Joi.string().pattern(/^[0-9]{10}$/).required()
        }),

        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),

        update: Joi.object({
            name: Joi.string().min(3).max(50),
            phone: Joi.string().pattern(/^[0-9]{10}$/),
            village: Joi.string(),
            preferences: Joi.object({
                notifications: Joi.boolean(),
                language: Joi.string().valid('en', 'hi')
            })
        })
    },

    project: {
        creation: Joi.object({
            title: Joi.string().min(5).max(100).required(),
            description: Joi.string().min(20).max(1000).required(),
            category: Joi.string().valid(
                'infrastructure',
                'education',
                'healthcare',
                'sanitation',
                'agriculture'
            ).required(),
            estimatedCost: Joi.number().min(0).required(),
            location: Joi.object({
                type: Joi.string().valid('Point').required(),
                coordinates: Joi.array().items(Joi.number()).length(2).required()
            }).required(),
            timeline: Joi.object({
                startDate: Joi.date().greater('now').required(),
                estimatedCompletion: Joi.date().greater(Joi.ref('startDate')).required()
            }).required(),
            villageId: Joi.string().required()
        }),

        update: Joi.object({
            status: Joi.string().valid('proposed', 'approved', 'in_progress', 'completed', 'cancelled'),
            progress: Joi.number().min(0).max(100),
            actualCost: Joi.number().min(0),
            completionDate: Joi.date(),
            updates: Joi.array().items(Joi.object({
                description: Joi.string().required(),
                date: Joi.date().required(),
                status: Joi.string().required()
            }))
        })
    },

    grievance: {
        submission: Joi.object({
            title: Joi.string().min(5).max(100).required(),
            description: Joi.string().min(20).max(1000).required(),
            category: Joi.string().valid(
                'infrastructure',
                'public_services',
                'corruption',
                'sanitation',
                'other'
            ).required(),
            location: Joi.object({
                type: Joi.string().valid('Point').required(),
                coordinates: Joi.array().items(Joi.number()).length(2).required()
            }).required(),
            attachments: Joi.array().items(Joi.string().uri()),
            priority: Joi.number().min(1).max(5)
        }),

        update: Joi.object({
            status: Joi.string().valid('pending', 'in_review', 'resolved', 'rejected'),
            response: Joi.string().min(10),
            assignedTo: Joi.string().hex().length(24),
            resolutionDetails: Joi.object({
                action: Joi.string().required(),
                date: Joi.date().required(),
                remarks: Joi.string()
            })
        })
    }
};

const validateRequest = (schema) => {
    return (data) => {
        const { error, value } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            throw new Error(JSON.stringify(errors));
        }
        return value;
    };
};

module.exports = {
    validationSchemas,
    validateRequest
};