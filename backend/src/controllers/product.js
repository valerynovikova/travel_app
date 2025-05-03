const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).populate('category').exec();
        if (!product) {
            return res.status(400).json({
                error: 'Product not found'
            });
        }
        req.product = product;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Error finding product'
        });
    }
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        const product = new Product(fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        try {
            const result = await product.save();
            res.json(result);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
    });
};

exports.remove = async (req, res) => {
    const product = req.product;

    try {
        await product.remove();
        res.json({
            message: 'Product deleted successfully'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.update = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        try {
            const result = await product.save();
            res.json(result);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
    });
};

exports.list = async (req, res) => {
    const order = req.query.order || 'asc';
    const sortBy = req.query.sortBy || '_id';
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;

    try {
        const products = await Product.find()
            .select('-photo')
            .populate('category')
            .sort([[sortBy, order]])
            .limit(limit)
            .exec();
        res.json(products);
    } catch (err) {
        return res.status(400).json({
            error: 'Products not found'
        });
    }
};

exports.listRelated = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;

    try {
        const products = await Product.find({ _id: { $ne: req.product._id }, category: req.product.category })
            .limit(limit)
            .populate('category', '_id name')
            .exec();
        res.json(products);
    } catch (err) {
        return res.status(400).json({
            error: 'Products not found'
        });
    }
};

exports.listCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category').exec();
        res.json(categories);
    } catch (err) {
        return res.status(400).json({
            error: 'Categories not found'
        });
    }
};

exports.listBySearch = async (req, res) => {
    const { order = 'desc', sortBy = '_id', limit = 100, skip, filters } = req.body;

    const findArgs = {};
    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                findArgs[key] = {
                    $gte: filters[key][0],
                    $lte: filters[key][1]
                };
            } else {
                findArgs[key] = filters[key];
            }
        }
    }

    try {
        const data = await Product.find(findArgs)
            .select('-photo')
            .populate('category')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec();
        res.json({ size: data.length, data });
    } catch (err) {
        return res.status(400).json({
            error: 'Products not found'
        });
    }
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.listSearch = async (req, res) => {
    const query = {};

    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        try {
            const products = await Product.find(query).select('-photo').exec();
            res.json(products);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
    }
};

exports.decreaseQuantity = async (req, res, next) => {
    const bulkOps = req.body.order.products.map(item => ({
        updateOne: {
            filter: { _id: item._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } }
        }
    }));

    try {
        await Product.bulkWrite(bulkOps);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Could not update product'
        });
    }
};
