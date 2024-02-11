const { Schema, model } = require('mongoose');
const Joi = require('joi');

module.exports.Product = model('Product', Schema({
    name: {
        type: String,
        minlength: [1, "please give atleast 1 character name"],
        required: [true, "please enter a name"]
    },
    description: {
        type: String,
        minlength: [5, "please give atleast 1 character description"],
        required: [true, "please enter a description"]
    },
    price: {
        type: Number,
        minlength: [1, "please enter a number"],
        required: [true, "please enter a Price"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "please enter category ID"],
    },
    quantity: {
        type: Number,
        minlength: [1, "please enter a number"],
        required: [true, "please enter quantity ammount"]
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        required: [true, "Need a photo"]
    }
}, { timestamps: true }));
// module.exports.validate = product =>{
//     const schema = Joi.object({
//         name : Joi.string().min(1).required(),
//         description:Joi.s
//     })
// }