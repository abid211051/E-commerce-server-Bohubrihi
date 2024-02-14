const router = require('express').Router();

const { offlinePayment, onlinePayment, getPaymentHistory } = require('../controllers/paymentController');
const authorize = require('../middleware/authorize');

router.route('/')
    .get(authorize, getPaymentHistory)

router.route('/offline')
    .post(authorize, offlinePayment)

router.route('/online')
    .post(authorize, onlinePayment)

module.exports = router;