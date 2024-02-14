const { CartItem } = require('../models/cartItem');
const { Profile } = require('../models/profile');
const { Payment } = require('../models/payment');
const { Product } = require('../models/product');
const { Coupon } = require('../models/coupon');
module.exports.offlinePayment = async (req, res) => {
    try {
        const tran_id = '_' + Math.random().toString(36).substring(2,) + (new Date()).getTime().toString(36);
        const cartitems = await CartItem.find({ user: req.user._id })
        const profile = await Profile.findOne({ user: req.user._id });
        const discount = await Coupon.findOne({ code: req.body.coupon }).select('discount');
        const arr = cartitems.map(Item => Item.price * Item.count);
        let sum = arr.reduce((a, b) => a + b, 0);
        if (discount) {
            if (discount.discount !== 0) {
                sum = sum - (sum * (discount.discount / 100));
            }
        }
        const newpayment = new Payment({
            transactionId: tran_id,
            customer: {
                deliveryAddress: profile,
                paymentType: 'Cash on Delivery',
            },
            cartitems: [...cartitems],
            orderTime: new Date(),
            price: sum + 10,
            paymentStatus: 'Pending',
            userId: req.user._id
        })
        await newpayment.save();
        res.status(201).send({ url: 'http://localhost:5173/user/dashboard' });

        const prod = cartitems.map((item) => {
            return { prod_id: item.product._id, count: item.count }
        });
        const updateOperation = prod.map((data) => (
            {
                updateOne: {
                    filter: { _id: data.prod_id },
                    update: { $inc: { sold: data.count } }
                }
            }
        ));
        await CartItem.deleteMany({ user: req.user._id })
        await Product.bulkWrite(updateOperation);
        await Coupon.updateOne({ code: req.body.coupon }, { $addToSet: { user: req.user._id } });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}


module.exports.getPaymentHistory = async (req, res) => {
    try {
        const history = await Payment.find({ userId: req.user._id })
            .populate({ path: 'cartitems', populate: { path: 'product', select: 'name' } })
        return res.status(201).send(history);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}


module.exports.onlinePayment = async (req, res) => {
    const carts = await CartItem.find({ user: req.user._id });

    return res.send('oh')
}