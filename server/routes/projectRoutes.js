// projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProjects,
    // getProject,
    createProject,
    updateProject,
    deleteProject,
    uploadProjectFiles,
    getProjectStats,
    getNearbyProjects
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateProject } = require('../middleware/validationMiddleware');

// // Public routes with caching
// const cache = require('../middleware/cache');
router.get('/', getProjects);
// router.get('/nearby', getNearbyProjects);
// router.get('/:id', cache('5 minutes'), getProject);

// Protected routes
router.use(protect);
router.post('/', validateProject, createProject);
// router.put('/:id', validateProject, updateProject);
// router.delete('/:id', deleteProject);
// router.post('/:id/files', uploadProjectFiles);

// Statistics and reports - Officials only
router.use(authorize('panchayat-official', 'admin'));
// router.get('/stats/overview', getProjectStats);
// router.get('/stats/category', async(req, res) => {
//     /* Category-wise stats logic */
// });
// router.get('/stats/budget', async(req, res) => {
//     /* Budget analysis logic */
// });

// Admin only routes
router.use(authorize('admin'));
router.put('/:id/approve', async(req, res) => {
    /* Project approval logic */
});

module.exports = router;