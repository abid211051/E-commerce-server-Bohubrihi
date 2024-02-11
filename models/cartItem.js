const { Schema, model } = require('mongoose');

const CartSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "Need a productId"]
    },
    price: Number,
    count: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Need a UserID"]
    }
}, { timestamps: true });

module.exports.CartSchema = CartSchema;
module.exports.CartItem = model('CartItem', CartSchema);