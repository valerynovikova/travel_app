const Category = require('../models/category');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Error fetching category'
        });
    }
};

exports.create = async (req, res) => {
    const category = new Category(req.body);
    try {
        const data = await category.save();
        res.json({ data });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.read = (req, res) => {
    return res.json(req.category);
};

exports.update = async (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    try {
        const data = await category.save();
        res.json(data);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.remove = async (req, res) => {
    const category = req.category;
    try {
        const products = await Product.find({ category });
        if (products.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You can't delete ${category.name}. It has ${products.length} associated products.`
            });
        }
        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.list = async (req, res) => {
    try {
        const data = await Category.find();
        res.json(data);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};
