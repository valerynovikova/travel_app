const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Error finding user'
        });
    }
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ _id: req.profile._id });
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        const updatedUser = await user.save();
        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;
        return res.json(updatedUser);
    } catch (err) {
        return res.status(400).json({
            error: 'User update failed'
        });
    }
};

exports.addOrderToUserHistory = async (req, res, next) => {
    let history = req.body.order.products.map(item => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: item.count,
        transaction_id: req.body.order.transaction_id,
        amount: req.body.order.amount
    }));

    try {
        await User.findOneAndUpdate(
            { _id: req.profile._id },
            { $push: { history: history } },
            { new: true }
        );
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Could not update user purchase history'
        });
    }
};

exports.purchaseHistory = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.profile._id })
            .populate('user', '_id name')
            .sort('-created')
            .exec();
        return res.json(orders);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};
