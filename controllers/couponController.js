const { Coupon } = require('../models/coupon');
module.exports.createCoupon = async (req, res) => {
    try {
        let coupon = await Coupon.findOne({ code: req.body.code });
        if (coupon) return res.status(400).send('Coupon in this name Already exist');
        coupon = new Coupon({
            code: req.body.code,
            discount: req.body.discount,
            events: req.body.events,
            expirein: req.body.expirein,
            companyid: req.user._id
        })
        await coupon.save();
        return res.status(201).send('Coupon created Successfully');
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            error: error.message,
            message: "Something went wrong"
        });
    }
}

module.exports.getCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find({ companyid: req.user._id });
        return res.status(201).send(coupons);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            error: error.message,
            message: "Something went wrong"
        });
    }
}

module.exports.applyCoupon = async (req, res) => {
    try {
        const iscoupon = await Coupon.findOne({ code: req.body.coupon });
        if (!iscoupon) return res.status(404).send('Coupon not found');
        const expirein = new Date(iscoupon.expirein);
        if (expirein < (new Date())) {
            return res.status(401).send('Expired')
        }
        else {
            if (iscoupon.user.includes(req.user._id)) {
                return res.status(401).send('Already used')
            }
            return res.status(201).send({
                code: iscoupon.code,
                discount: iscoupon.discount
            });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            error: error.message,
            message: "Something went wrong"
        });
    }
}