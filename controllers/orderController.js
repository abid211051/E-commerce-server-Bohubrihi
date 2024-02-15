const { CartItem } = require('../models/cartItem');
const { Profile } = require('../models/profile');
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { Coupon } = require('../models/coupon');

const SSLCommerzPayment = require('sslcommerz-lts');
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false

module.exports.offlineOrder = async (req, res) => {
    try {
        const tran_id = '_' + Math.random().toString(36).substring(2,) + (new Date()).getTime().toString(36);
        const cartitems = await CartItem.find({ user: req.user._id })
            .populate({ path: 'product', select: 'name', populate: { path: 'category', select: 'name' } });
        const profile = await Profile.findOne({ user: req.user._id });
        const discount = await Coupon.findOne({ code: req.body.coupon }).select('discount');
        const arr = cartitems.map(Item => Item.price * Item.count);
        let sum = arr.reduce((a, b) => a + b, 0);
        if (discount) {
            if (discount.discount !== 0) {
                sum = sum - (sum * (discount.discount / 100));
            }
        }
        const neworder = new Order({
            transactionId: tran_id,
            customer: {
                deliveryAddress: profile,
                paymentType: 'Cash on Delivery',
            },
            cartitems: [...cartitems],
            orderTime: new Date(),
            price: sum + 10,
            paymentStatus: 'Pending',
            userId: req.user._id,
            coupon: req.body.coupon
        })
        await neworder.save();
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


module.exports.getOrderHistory = async (req, res) => {
    try {
        const history = await Order.find({ userId: req.user._id })
            .populate({ path: 'cartitems', populate: { path: 'product', select: 'name' } })
        return res.status(201).send(history);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}


module.exports.onlineOrder = async (req, res) => {
    try {
        const tran_id = '_' + Math.random().toString(36).substring(2,) + (new Date()).getTime().toString(36);
        const cartitems = await CartItem.find({ user: req.user._id })
            .populate({ path: 'product', select: 'name', populate: { path: 'category', select: 'name' } });
        const profile = await Profile.findOne({ user: req.user._id });
        const discount = await Coupon.findOne({ code: req.body.coupon }).select('discount');

        let sum = 0;
        let prod_name = '';
        let prod_categ = '';
        for (const item of cartitems) {
            sum += item.price;
            prod_name += `${item.product.name}, `;
            prod_categ += `${item.product.category.name}, `
        }
        if (discount) {
            if (discount.discount !== 0) {
                sum = sum - (sum * (discount.discount / 100));
            }
        }
        const data = {
            total_amount: sum,
            currency: 'BDT',
            tran_id: tran_id, // use unique tran_id for each api call
            success_url: `https://e-commerce-server-drab.vercel.app/server/payment/success/${tran_id}`,
            fail_url: `https://e-commerce-server-drab.vercel.app/server/payment/fail/${tran_id}`,
            cancel_url: `https://e-commerce-server-drab.vercel.app/server/payment/cancel/${tran_id}`,
            ipn_url: 'https://e-commerce-server-drab.vercel.app/server/payment/ipn',
            shipping_method: 'Courier',
            product_name: prod_name,
            product_category: prod_categ,
            product_profile: 'general',
            cus_name: req.user.name,
            cus_email: req.user.email,
            cus_add1: profile.address1,
            cus_add2: profile.address2,
            cus_city: profile.city,
            cus_state: profile.state,
            cus_postcode: profile.postcode,
            cus_country: 'Bangladesh',
            cus_phone: profile.phone,
            ship_name: req.user.name,
            ship_add1: profile.address1,
            ship_add2: profile.address2,
            ship_city: profile.city,
            ship_state: profile.state,
            ship_postcode: profile.postcode,
            ship_country: 'Bangladesh',
        };
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        sslcz.init(data).then(async (apiResponse) => {
            const neworder = new Order({
                transactionId: tran_id,
                customer: {
                    deliveryAddress: profile,
                    paymentType: 'online',
                },
                cartitems: [...cartitems],
                orderTime: new Date(),
                price: sum,
                paymentStatus: 'Pending',
                userId: req.user._id,
                coupon: req.body.coupon
            })
            // Redirect the user to payment gateway
            if (apiResponse.status === "SUCCESS") {
                await neworder.save();
            }
            let GatewayPageURL = apiResponse.GatewayPageURL
            console.log(GatewayPageURL)
            res.status(200).send({ url: GatewayPageURL })
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}

module.exports.success = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params.tran_id)
        const orderdata = await Order.updateOne({ transactionId: req.params.tran_id }, {
            $set: {
                paymentStatus: "Paid Successfully"
            }
        })
        if (orderdata.modifiedCount > 0) {
            res.redirect(`https://master--grand-brioche-503f76.netlify.app/user/dashboard`);
        }
    } catch (error) {
        res.redirect(`https://master--grand-brioche-503f76.netlify.app/`);
    }
}

module.exports.fail = async (req, res) => {

}

module.exports.cancel = async (req, res) => {

}










// module.exports.ipn = async (req, res) => {
//     try {
// const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
// if (req.body.status === 'VALID') {
//     sslcz.validate(req.body).then(data => {
//         if (data.status === 'VALID') {
//             Order.updateOne({ transactionId: req.body.tran_id }, { paymentStatus: 'Success' })
//                 .then(result => res.status(201).send('ok'))
//                 .catch(err => res.status(400).send('failed'));
//         }
//     });
// const prod = order.cartitems.map((item) => {
//     return { prod_id: item.product._id, count: item.count }
// });
// const updateOperation = prod.map((data) => (
//     {
//         updateOne: {
//             filter: { _id: data.prod_id },
//             update: { $inc: { sold: data.count } }
//         }
//     }
// ));
// await CartItem.deleteMany({ user: order.userId });
// await Product.bulkWrite(updateOperation);
// await Coupon.updateOne({ code: order.coupon }, { $addToSet: { user: order.userId } });
// }
// else {
//     return res.status(500).send('failed');
// }
// } catch (error) {
//     console.log(error.message);
//     return res.status(500).send(error.message);
// }
// }