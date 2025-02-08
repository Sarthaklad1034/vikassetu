const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    interactWithPost,
    getMeetings,
    getPolls,
    getAnnouncements
} = require('../controllers/communityController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validatePost } = require('../middleware/validationMiddleware');


// // Public routes with caching
// router.get('/', cache('2 minutes'), getPosts);
// router.get('/announcements', cache('5 minutes'), getAnnouncements);
// router.get('/:id', cache('2 minutes'), getPost);

// Protected routes
router.use(protect);
router.post('/', createPost);
// router.put('/:id', validatePost, updatePost);
// router.delete('/:id', deletePost);
router.post('/:id/interact', interactWithPost);

// Type-specific routes
// router.get('/meetings/upcoming', getMeetings);
// router.get('/polls/active', getPolls);

// Official routes
router.use(authorize('panchayat-official', 'admin'));
// router.post('/announcements', async(req, res) => {
//     /* Official announcement creation */
// });
// router.post('/meetings/gram-sabha', async(req, res) => {
//     /* Gram Sabha meeting creation */
// });

// Admin routes
router.use(authorize('admin'));
// router.put('/:id/moderate', async(req, res) => {
//     /* Content moderation logic */
// });

module.exports = router;