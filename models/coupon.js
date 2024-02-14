const { Schema, model } = require('mongoose');

const couponSchema = Schema({
    code: {
        type: String,
        minlength: [3, 'Need at least 3 letters'],
        unique: true
    },
    discount: {
        type: Number,
        min: [1, "Discount cannot be less than one"],
        max: [100, "Discount cannot be more than One hundred"],
        required: [true, 'Discount field required']
    },
    expirein: {
        type: Date,
        required: [true, 'Expiration is required']
    },
    events: {
        type: String,
        required: [true, 'Expiration is required']
    },
    companyid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

module.exports.Coupon = model('Coupon', couponSchema);