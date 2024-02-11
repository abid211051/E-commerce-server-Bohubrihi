const { Schema, model } = require('mongoose');

const categorySchema = Schema({
    name: {
        type: String,
        unique: [true, "Category must be a unique one"],
        required: [true, "Name cannot remain empty"],
        minlength: [1, "Please add a at least one length name"]
    }
}, { timestamps: true })

module.exports.Category = model('Category', categorySchema);