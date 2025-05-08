const { Category } = require("../models/category");
module.exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
    });
    const result = await category.save();
    return res.status(201).send({
      message: "Category created successfully",
      category: {
        _id: result._id,
        name: result.name,
      },
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports.getCategory = async (req, res) => {
  try {
    const category = await Category.find()
      .sort({ name: 1 })
      .select({ _id: 1, name: 1 });
    return res.status(201).send({
      message: "Categories got successfully",
      category: category,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
