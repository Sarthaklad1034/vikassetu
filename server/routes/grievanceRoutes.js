const express = require('express');
const router = express.Router();
const {
    submitGrievance,
    getGrievances,
    getGrievance,
    updateGrievance,
    escalateGrievance,
    resolveGrievance,
    getGrievanceStats
} = require('../controllers/grievanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateGrievance } = require('../middleware/validationMiddleware');

// Protected routes
router.use(protect);
router.post('/', submitGrievance);
// router.get('/', getGrievances);
// router.get('/:id', getGrievance);
// router.post('/:id/escalate', escalateGrievance);

// Official routes
router.use(authorize('panchayat-official', 'admin'));
router.put('/:id', updateGrievance);
// router.put('/:id/resolve', resolveGrievance);
// router.get('/stats/overview', getGrievanceStats);
// router.get('/stats/category', async(req, res) => {
//     /* Category-wise analysis */
// });
// router.get('/stats/resolution-time', async(req, res) => {
//     /* Resolution time analysis */
// });

// Admin routes
router.use(authorize('admin'));
// router.get('/stats/sla-breach', async(req, res) => {
//     /* SLA breach analysis */
// });

module.exports = router;