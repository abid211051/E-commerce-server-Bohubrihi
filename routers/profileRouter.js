const router = require('express').Router();
const { setProfile, getProfile } = require('../controllers/profileController');
const authorize = require('../middleware/authorize');

router.route('/')
    .post(authorize, setProfile)
    .get(authorize, getProfile);

module.exports = router;