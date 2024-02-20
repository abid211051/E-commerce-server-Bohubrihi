const _ = require('lodash');
const { CartItem } = require('../models/cartItem');


module.exports.createCartItem = async (req, res) => {
    try {
        let { price, product } = _.pick(req.body, ["price", "product"]);
        const item = await CartItem.findOne({
            user: req.user._id,
            product: product,
        });
        if (item) return res.status(400).send("Item already exists in Cart!");
        let cartItem = new CartItem({ price: price, product: product, user: req.user._id });
        const result = await cartItem.save();
        res.status(201).send({
            message: "Added to cart successfully!",
            cart: result,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'Something went wrong'
        })
    }
}

module.exports.getCartItem = async (req, res) => {
    try {
        const cartItems = await CartItem.find({
            user: req.user._id
        })
            .populate('product', 'name photo')
            .populate('user', 'name')
        for (const key in cartItems) {
            cartItems[key].product['photo'] = `https://e-commerce-70e6.onrender.com/${cartItems[key].product['photo']}`
        }
        return res.status(200).send(cartItems);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'Something went wrong'
        })
    }
}

module.exports.updateCartItem = async (req, res) => {
    try {
        const { _id, count } = _.pick(req.body, ["count", "_id"]);
        userId = req.user._id;
        await CartItem.updateOne({ _id: _id, user: userId }, { count: count });
        return res.status(200).send("Item updated!!");
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'Something went wrong'
        })
    }
}

module.exports.deleteCartItem = async (req, res) => {
    try {
        const _id = req.params.id;
        console.log(_id)
        userId = req.user._id;
        await CartItem.deleteOne({ _id: _id, user: userId });
        return res.status(200).send("Deleted!");
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'Something went wrong'
        })
    }
}