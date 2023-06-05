const User = require('./../models/userModel');
const crudHandler = require('./../controllers/crudHandler');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...fields) => {
    const newObj = {};
    Object.keys(obj).forEach((item) => {
        if (fields.includes(item)) newObj[item] = obj[item];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1. Create new Error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for update password! Please use /updateMyPassword',
                400
            )
        );
    }

    // 2. Filter some fields name are not allowed to be updated
    const filterBody = filterObj(req.body, 'name', 'email');

    // 3. Update user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getAllUsers = crudHandler.getAll(User);

exports.getUser = crudHandler.getOne(User);

// DO NOT UPDATE PASSWORD WITH THIS
exports.updateUser = crudHandler.updateOne(User);

exports.deleteUser = crudHandler.deleteOne(User);
