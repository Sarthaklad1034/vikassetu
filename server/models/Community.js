const mongoose = require('mongoose');

// Separate schema for comments
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: [{
        type: String,
        fileUrl: String,
        uploadedAt: Date
    }],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    parentComment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    }
}, {
    timestamps: true
});

// Separate schema for polls
const pollOptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: [100, 'Option text cannot exceed 100 characters']
    },
    votes: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

// Main community schema
const communitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['discussion', 'announcement', 'poll', 'meeting', 'gram-sabha']
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
    },
    location: {
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
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [String],
    visibility: {
        type: String,
        enum: ['public', 'village', 'panchayat', 'admin'],
        default: 'public'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived', 'removed'],
        default: 'published'
    },
    // Fields for meetings and gram sabha
    meeting: {
        date: Date,
        duration: Number, // in minutes
        venue: String,
        agenda: [String],
        attendees: [{
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'declined'],
                default: 'pending'
            }
        }],
        minutes: {
            content: String,
            attachments: [String],
            publishedAt: Date
        }
    },
    // Fields for polls
    poll: {
        options: [pollOptionSchema],
        endDate: Date,
        allowMultipleVotes: {
            type: Boolean,
            default: false
        },
        isAnonymous: {
            type: Boolean,
            default: false
        }
    },
    // Engagement metrics
    engagement: {
        views: {
            type: Number,
            default: 0
        },
        likes: [{
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }],
        shares: {
            type: Number,
            default: 0
        }
    },
    comments: [commentSchema],
    // Moderation
    moderation: {
        isModerated: {
            type: Boolean,
            default: false
        },
        moderatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        moderationDate: Date,
        moderationReason: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
communitySchema.index({ 'location.coordinates': '2dsphere' });
communitySchema.index({ type: 1, status: 1 });
communitySchema.index({ 'location.village': 1, 'location.district': 1 });
communitySchema.index({ tags: 1 });

// Virtual for total votes in a poll
communitySchema.virtual('totalVotes').get(function() {
    if (this.type !== 'poll') return 0;
    return this.poll.options.reduce((total, option) => total + option.votes.length, 0);
});

// Methods
communitySchema.methods = {
    // Add view
    async addView() {
        this.engagement.views += 1;
        return this.save();
    },

    // Toggle like
    async toggleLike(userId) {
        const likes = this.engagement.likes;
        const index = likes.indexOf(userId);

        if (index === -1) {
            likes.push(userId);
        } else {
            likes.splice(index, 1);
        }

        return this.save();
    },

    // Add comment
    async addComment(comment) {
        this.comments.push(comment);
        return this.save();
    },

    // Vote in poll
    async votePoll(userId, optionIndex) {
        if (this.type !== 'poll') {
            throw new Error('This post is not a poll');
        }

        if (Date.now() > this.poll.endDate) {
            throw new Error('Poll has ended');
        }

        const option = this.poll.options[optionIndex];
        if (!option) {
            throw new Error('Invalid option');
        }

        if (!this.poll.allowMultipleVotes) {
            // Remove existing votes by this user
            this.poll.options.forEach(opt => {
                opt.votes = opt.votes.filter(vote => vote.user.toString() !== userId.toString());
            });
        }

        option.votes.push({ user: userId });
        return this.save();
    },

    // Check if user can view
    canView(user) {
        if (this.visibility === 'public') return true;
        if (!user) return false;

        switch (this.visibility) {
            case 'village':
                return user.village === this.location.village;
            case 'panchayat':
                return user.role === 'panchayat-official' &&
                    user.district === this.location.district;
            case 'admin':
                return user.role === 'admin';
            default:
                return false;
        }
    },

    // Generate meeting link
    generateMeetingLink() {
        if (this.type !== 'meeting' && this.type !== 'gram-sabha') {
            throw new Error('This post is not a meeting');
        }
        // Generate unique meeting link based on post ID and meeting date
        return `https://meet.vikassetu.gov.in/${this._id}`;
    }
};

// Static methods
communitySchema.statics = {
    // Get trending posts
    async getTrending(limit = 10) {
        return this.find({ status: 'published' })
            .sort({ 'engagement.views': -1, 'engagement.likes': -1 })
            .limit(limit)
            .populate('author', 'name village');
    },

    // Get upcoming meetings
    async getUpcomingMeetings(village) {
        const query = {
            type: { $in: ['meeting', 'gram-sabha'] },
            status: 'published',
            'meeting.date': { $gt: new Date() }
        };

        if (village) {
            query['location.village'] = village;
        }

        return this.find(query)
            .sort({ 'meeting.date': 1 })
            .populate('author', 'name role');
    }
};

// Middleware
communitySchema.pre('save', function(next) {
    // Auto-archive polls after end date
    if (this.type === 'poll' && this.poll.endDate < new Date()) {
        this.status = 'archived';
    }
    next();
});

module.exports = mongoose.model('Community', communitySchema);