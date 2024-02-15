const router = require('express').Router();

const { getOrderHistory, offlineOrder, onlineOrder, ipn, success, fail, cancel } = require('../controllers/orderController');
const authorize = require('../middleware/authorize');

router.route('/')
    .get(authorize, getOrderHistory)

router.route('/offline')
    .post(authorize, offlineOrder)

router.route('/online')
    .post(authorize, onlineOrder)

router.route('/success/:tran_id')
    .post(success)

router.route('/fail/:tran_id')
    .post(fail)

router.route('/cancel/:tran_id')
    .post(cancel)

router.route('/ipn')
    .post(ipn)
module.exports = router;