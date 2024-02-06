const { Category } = require('../models/category');
module.exports.createCategory = async (req, res) => {
    try {
        const category = new Category({
            name: req.name
        })
        const result = await category.save();
        return res.status(201).send({
            message: 'Category created successfully',
            _id: result._id,
            name: result.name
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}

module.exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find().sort({ name: 1 }).select({ _id: 1, name: 1 });
        return res.status(500).send({
            message: "Categories got successfully",
            categories: category
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}