const User = require('./../Models/User');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../utils/CustomError');
const util = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = id =>{
    return jwt.sign({id}, process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    });
}

exports.createSendResponse = (user, statusCode, res) =>{
    const token = signToken(user._id);

    const options = {
        maxAge: process.env.LOGIN_EXPIRES,
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production')
        options.secure = true;

    res.cookie('jwt', token, options);
    user.password = undefined;

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

exports.signup = asyncErrorHandler(async(req, res, next)=>{
    const newUser = await User.create(req.body);
    this.createSendResponse(newUser, 201, res);
})

exports.login = asyncErrorHandler(async(req, res, next)=>{
     const email = req.body.email;
     const password = req.body.password;

     if (!email || !password) {
        const error = new CustomError('Please provide Email and Password', 400);
        return next(error);
     }

     const user = await User.findOne({email}).select('+password');
    //  const isMatch = await user.comparePasswordInDb(password, user.password);

     if(!user || !(await user.comparePasswordInDb(password, user.password))){
        const error = new CustomError('Incorrect email or password',400);
        return next(error);
     }

     this.createSendResponse(user, 200, res);
})

exports.protect = asyncErrorHandler(async(req, res, next)=>{
    // 1. read the token & check if it is exist
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1];
    }

    if (!token) {
        next(new CustomError('You are not logged in!', 401));
    }

    // 2. validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    // 3. if the user exists
    const authUser = await User.findById(decodedToken.id);
    if (!authUser) {
        const error = new CustomError('The user with the given token does not exist.', 401);
        next(error);
    }

    // 4. if the user changed password after the token was issued
    const isPasswordChanged = await authUser.isPasswordChanged(decodedToken.iat)
    if (isPasswordChanged) {
        const error = new CustomError('The password has been changed. Please login again.',401);
        return next(error);
    }

    // 5. allow user to access route
    req.user = authUser;
    next();
})

exports.restrict = (...role)=>{
    return (req, res, next)=>{
        if (!role.includes(req.user.role)) {
            const error = new CustomError('You dont have permission to delete.',403);
            next(error);
        }
        next();
    }
}

exports.forgotPassword = asyncErrorHandler(async(req, res, next)=>{
    // 1. get user based on posted email
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        const error = new CustomError('User could not find with given email', 404);
        next(error);
    }

    // 2. generate a random reset token
    const resetToken = user.createResetPasswordToken();
    await user.save({validateBeforeSave: false});

    // 3. send the token back to the user email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;
    const message = `Please reset your password \n\n ${resetUrl} \n\n This is valid for 10 miniuts.`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Change Password',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Password reset link has been sent to the user email.'
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({validateBeforeSave: false});

        return next(new CustomError('There was an error while sending reset password link, please try again.', 500));
    }
});

exports.passwordReset = asyncErrorHandler(async(req, res, next)=>{
    // 1. IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}});
    
    if (!user) {
        const error = new CustomError('Token is invalid or has expired!', 400);
        next(error);
    }

    // 2. RESETING THE USER PASSWORD
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    user.save();

    // 3. LOGIN THE USER (Note:- after reset password, movies data can not be fatched, it says password has been changed.)
    this.createSendResponse(user, 200, res);
});