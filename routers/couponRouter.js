const router = require('express').Router();

const authorize = require('../middleware/authorize');
const isadmin = require('../middleware/isadmin');

const { createCoupon, getCoupon, applyCoupon } = require('../controllers/couponController');
router.route('/')
    .post([authorize, isadmin], createCoupon)
    .get([authorize, isadmin], getCoupon)

router.route('/apply')
    .post(authorize, applyCoupon)
module.exports = router;