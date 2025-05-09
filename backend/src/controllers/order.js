const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.orderById = async (req, res, next, id) => {
    try {
        const order = await Order.findById(id)
            .populate('products.product', 'name price')
            .exec();

        if (!order) {
            return res.status(400).json({
                error: 'Order not found'
            });
        }

        req.order = order;
        next();
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};


exports.create = async (req, res) => {
    
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);

    try {
        const data = await order.save();
        res.json(data);
    } catch (error) {
        return res.status(400).json({
            error: errorHandler(error)
        });
    }
};


exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', '_id name address')
            .sort('-created')
            .exec();

        res.json(orders);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};


exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.updateOne(
            { _id: req.body.orderId },
            { $set: { status: req.body.status } }
        );

        if (!order.nModified) {
            return res.status(400).json({
                error: 'Order status update failed or order not found'
            });
        }

        res.json(order);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};
