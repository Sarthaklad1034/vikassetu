const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide project title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide project description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please specify project category'],
        enum: [
            'roads',
            'water-supply',
            'sanitation',
            'education',
            'healthcare',
            'agriculture',
            'other'
        ]
    },
    status: {
        type: String,
        enum: ['proposed', 'approved', 'in-progress', 'completed', 'rejected'],
        default: 'proposed'
    },
    priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    budget: {
        estimated: {
            type: Number,
            required: [true, 'Please provide estimated budget']
        },
        approved: {
            type: Number,
            default: 0
        }
    },
    timeline: {
        estimatedStart: Date,
        estimatedCompletion: Date,
        actualStart: Date,
        actualCompletion: Date
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        village: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    beneficiaries: {
        estimated: {
            type: Number,
            required: true
        },
        categories: [{
            type: String,
            enum: ['general', 'sc', 'st', 'obc', 'minority']
        }]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    contractor: {
        name: String,
        phone: String,
        email: String
    },
    documents: [{
        title: String,
        fileUrl: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    progress: [{
        status: String,
        description: String,
        images: [String],
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    votes: {
        up: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        down: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
    },
    aiAnalysis: {
        impactScore: Number,
        feasibilityScore: Number,
        priorityRecommendation: String,
        risks: [String],
        similarProjects: [{
            projectId: { type: mongoose.Schema.ObjectId, ref: 'Project' },
            similarity: Number
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
projectSchema.index({ location: '2dsphere' });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ 'location.village': 1, 'location.district': 1 });

// Virtual field for comments
projectSchema.virtual('comments', {
    ref: 'Community',
    localField: '_id',
    foreignField: 'project',
    justOne: false
});

// Calculate vote count
projectSchema.virtual('voteCount').get(function() {
    return this.votes.up.length - this.votes.down.length;
});

// Middleware to update AI analysis before saving
projectSchema.pre('save', async function(next) {
    if (this.isModified('description') || this.isModified('category')) {
        // Trigger AI analysis here
        // This would typically call an external service
        next();
    }
    next();
});

module.exports = mongoose.model('Project', projectSchema);