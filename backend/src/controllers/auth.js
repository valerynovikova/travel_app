const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = async (req, res) => {
    try {
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password; // важно! это виртуальное поле
        await user.save();

        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({ user });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(400).json({
            error: 'Email is taken or invalid data',
            details: err.message
        });
    }
};


exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }

        const isPasswordValid = await user.authenticate(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Email and password don’t match'
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token, { expire: new Date() + 9999 });

        const { _id, name, role } = user;
        return res.json({ token, user: { _id, email, name, role } });

    } catch (err) {
        
        return res.status(400).json({
            error: 'Signin failed'
        });
    }
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resource! Access denied'
        });
    }
    next();
};
