const { Product, validate } = require('../models/product');
const fs = require('fs');

module.exports.createProduct = async (req, res) => {
    try {
        if (req.files.length < 1) return res.status(400).send('select an image');
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            quantity: req.body.quantity,
            photo: req.files[0].filename
        })
        const result = await product.save();
        const imageurl = `https://e-commerce-server-six.vercel.app/${req.files[0].filename}`;
        return res.status(201).send({
            message: 'Product added successfully',
            product: {
                _id: result._id,
                name: result.name,
                description: result.description,
                price: result.price,
                category: result.category,
                quantity: result.quantity,
                photo: imageurl
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'SomeThing Went wrong'
        });
    }
}

// query string: http://localhost:3001/server/product?order=desc&sortBy=price&limit=5&search='abc'
module.exports.getProducts = async (req, res) => {
    try {
        let order = req.query.order === 'desc' ? -1 : 1;
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 5;
        let skip = parseInt(req.query.skip);
        let search = req.query.search !== '' ? { name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } } : {};
        const count = await Product.countDocuments();
        skip = skip > count || skip < 0 ? 0 : skip;
        const product = await Product.find(search)
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
        // .select({ photo: 0 })

        for (const item of product) {
            item.photo = `https://e-commerce-server-six.vercel.app/${item.photo}`;
        }
        return res.status(201).send({
            message: 'products got successfully',
            product: product,
            count
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'SomeThing Went wrong'
        });
    }
}

module.exports.getProductById = async (req, res) => {
    const prodId = req.params.id;
    try {
        const product = await Product.findById(prodId)
            .populate('category', 'name');
        if (!product) return res.status(400).send('No product in that ID');
        product.photo = `https://e-commerce-server-six.vercel.app/${product.photo}`;
        return res.status(201).send({
            message: 'product got successfully',
            product: product
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'SomeThing Went wrong'
        });
    }
}

module.exports.filterProduct = async (req, res) => {
    // console.log(req.body);
    let order = req.body.order === 'desc' ? -1 : 1;
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);
    let search = req.body.search !== '' ? { name: { $regex: '.*' + req.body.search + '.*', $options: 'i' } } : {};
    let filters = req.body.filters;
    let obj = {};
    for (const key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                obj['price'] = { $gte: filters.price[0], $lte: filters.price[1] }
            }
            if (key === 'category') {
                obj['category'] = { $in: filters.category }
            }
        }
    }

    const product = await Product.find({ $and: [search, obj] })
        .sort({ [sortBy]: order })
        .limit(limit)
        .skip(skip)
        .populate('category', 'name');

    for (const item of product) {
        item.photo = `https://e-commerce-server-six.vercel.app/${item.photo}`;
    }
    return res.status(201).send({
        message: 'products got successfully',
        product: product
    });
}

module.exports.updateProduct = async (req, res) => {
    try {
        const prodId = req.params.id;
        const updateData = {
            name: req.body.name === "" ? undefined : req.body.name,
            description: req.body.description === "" ? undefined : req.body.description,
            price: req.body.price === "" ? undefined : req.body.price,
            category: req.body.category === "" ? undefined : req.body.category,
            quantity: req.body.quantity === "" ? undefined : req.body.quantity,
            photo: req.files.length < 1 ? undefined : req.files[0].filename
        }
        // 1707377944217-88941828vsstudio.png
        // 1707378026523-64500494vsstudio.png
        const result = await Product.findOneAndUpdate(
            { _id: prodId },
            updateData,
            { upsert: true }
        )
        if (req.files.length > 0 && result && result.photo) {
            await fs.promises.unlink(`..\\server\\uploads\\${result.photo}`)
        }
        return res.status(201).send({
            message: 'Updated successfully',
            id: result._id
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
            message: 'SomeThing Went wrong'
        });
    }
}



