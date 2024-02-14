const { Schema, model } = require('mongoose');

const reviewSchema = Schema({
    prodid: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: {
        type: String,
    },
    ratings: {
        type: Number,
        default: 1
    },
    feedback: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports.Review = model('Review', reviewSchema);