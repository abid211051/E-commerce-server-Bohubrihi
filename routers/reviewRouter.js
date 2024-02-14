const router = require('express').Router()

const authorize = require('../middleware/authorize');
const { createReview, getReviewbyId } = require('../controllers/reviewController');
router.route('/')
    .post(authorize, createReview)

router.route('/:id')
    .get(getReviewbyId)

module.exports = router;