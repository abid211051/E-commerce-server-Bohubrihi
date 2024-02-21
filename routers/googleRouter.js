require('../config/googleauthConfig');
const passport = require('passport');
const router = require('express').Router();

router.route('/')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/redirect')
    .get(passport.authenticate('google', { session: false }), (req, res) => {
        if (req.user.token !== null || req.user.token !== undefined || req.user.token !== '')
            return res.redirect(`https://dom-store-e-commerce.netlify.app?token=${req.user.token}`);
        return res.redirect(`https://dom-store-e-commerce.netlify.app/login`);
    })

module.exports = router;