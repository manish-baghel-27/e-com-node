const User = require('./../Models/User');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const authController = require('./authController');
// const jwt = require('jsonwebtoken');
const CustomError = require('./../utils/CustomError');
// const util = require('util');
// const sendEmail = require('./../utils/email');
// const crypto = require('crypto');

exports.getAllUsers = asyncErrorHandler(async(req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        status:'success',
        result: users.length,
        data:{
            users
        }
    })
})

const filterReqObj = (obj, ...allowedFields) =>{
    const newObj ={};
    Object.keys(obj).forEach(prop => {
        if (allowedFields.includes(prop)) {
            newObj[prop] = obj[prop];
        }
    });
    return newObj;
}

exports.updatePassword = asyncErrorHandler(async(req, res, next)=>{
    // GET CURRENT USER DATA FROM DATABASE
    const user = await User.findById(req.user._id).select('+password');

    // CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
    if (!await(user.comparePasswordInDb(req.body.currentPassword, user.password))) {
        return next(new CustomError('Wrong password.',401));
    }

    // IF SUPPLIED PASSWARD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // LOGIN USER & SEND JWT
    authController.createSendResponse(user, 200, res);
});

exports.updateProfile = asyncErrorHandler(async(req, res, next)=>{
    // 1. CHECK IF REQUEST DATA CONTAINS PASSWORD AND CONFIRM PASSWORD
    if (req.body.password || req.body.confirmPassword) {
        return next(new CustomError('Password can not be updated using this endpoint', 400));
    }

    // 2. UPDATE USER PROFILE
    const filterObj = filterReqObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {runValidators: true, new: true});

    res.status(200).json({
        status:'success',
        data:{
            user: updatedUser
        }
    })
})

exports.deleteUser = asyncErrorHandler(async(req, res, next)=>{
    await User.findByIdAndUpdate(req.user.id, {isDeleted: true});

    res.status(204).json({
        status: 'success',
        data: null
    })
})