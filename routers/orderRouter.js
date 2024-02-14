const router = require('express').Router();

const { getOrderHistory, offlineOrder, onlineOrder, ipn } = require('../controllers/orderController');
const authorize = require('../middleware/authorize');

router.route('/')
    .get(authorize, getOrderHistory)

router.route('/offline')
    .post(authorize, offlineOrder)

router.route('/online')
    .post(authorize, onlineOrder)

router.route('/ipn')
    .post(ipn)
module.exports = router;