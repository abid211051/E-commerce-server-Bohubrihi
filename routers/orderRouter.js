const router = require('express').Router();

const { getOrderHistory, offlineOrder, onlineOrder } = require('../controllers/orderController');
const authorize = require('../middleware/authorize');

router.route('/')
    .get(authorize, getOrderHistory)

router.route('/offline')
    .post(authorize, offlineOrder)

router.route('/online')
    .post(authorize, onlineOrder)

module.exports = router;