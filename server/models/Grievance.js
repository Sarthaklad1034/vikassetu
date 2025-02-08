const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide grievance title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide grievance description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: true,
        enum: [
            'infrastructure',
            'public-services',
            'welfare-schemes',
            'corruption',
            'administration',
            'other'
        ]
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'rejected'],
        default: 'pending'
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
        address: {
            village: String,
            district: String,
            state: String,
            pincode: String
        }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    attachments: [{
        type: String,
        fileUrl: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    timeline: [{
        status: String,
        comment: String,
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolution: {
        resolvedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        resolvedAt: Date,
        comment: String,
        attachments: [String],
        satisfactionRating: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    escalation: {
        isEscalated: {
            type: Boolean,
            default: false
        },
        reason: String,
        escalatedAt: Date,
        escalatedTo: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    },
    aiAnalysis: {
        sentiment: String,
        urgencyScore: Number,
        similarGrievances: [{
            grievanceId: { type: mongoose.Schema.ObjectId, ref: 'Grievance' },
            similarity: Number
        }],
        recommendedActions: [String]
    },
    sla: {
        deadline: Date,
        isBreached: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
grievanceSchema.index({ location: '2dsphere' });
grievanceSchema.index({ status: 1, priority: 1 });
grievanceSchema.index({ 'location.address.village': 1, category: 1 });

// Auto-set SLA deadline based on priority
grievanceSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('priority')) {
        const deadlines = {
            urgent: 24,
            high: 72,
            medium: 120,
            low: 168
        };
        const hours = deadlines[this.priority];
        this.sla.deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
    }
    next();
});

// Check SLA breach
grievanceSchema.methods.checkSLABreach = function() {
    if (this.status !== 'resolved' && Date.now() > this.sla.deadline) {
        this.sla.isBreached = true;
        return true;
    }
    return false;
};

// Virtual for time remaining until SLA breach
grievanceSchema.virtual('slaTimeRemaining').get(function() {
    if (this.status === 'resolved') return 0;
    return Math.max(0, this.sla.deadline - Date.now());
});

module.exports = mongoose.model('Grievance', grievanceSchema);