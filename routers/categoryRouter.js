const router = require('express').Router();
const authorize = require('../middleware/authorize');
const isadmin = require('../middleware/isadmin');
const { createCategory, getCategory } = require('../controllers/categoryController');

router.route('/')
    .post([authorize, isadmin], createCategory)
    .get(authorize, getCategory)

module.exports = router;