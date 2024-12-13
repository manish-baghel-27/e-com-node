const CustomError = require('./../utils/CustomError');

const devErrors = (res, err)=>{
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        stackTrace: err.stack,
        error:err
    });
}

const castErrorHandler = (err)=>{
    const msg = `Invalid value for ${err.path}: ${err.value}!`;
    return new CustomError(msg, 400);
}

const duplicateKeyErrorHandler=(err)=>{
    // const name = err.keyValue.name;
    // const msg = `Same name ${name} can't be inserted`;
    const email = err.keyValue.email;
    const msg = `Same email ${email} can't be inserted`;
    return new CustomError(msg, 400);
}

const validationErrorHandler = (err) =>{
    const getErrorMsgArray = Object.values(err.errors).map(val => val.message);
    const errorMessages = getErrorMsgArray.join('. ');
    const msg = `Invalid input data: ${errorMessages}`;

    return new CustomError(msg, 400);
}

const handleExpiredJWT = (err) =>{
    return new CustomError('JWT has expired. Please login again!', 401);
}

const handleJWTError = (err) =>{
    return new CustomError('Invalid token. Please login again!', 401);
}

const prodErrors = (res, err)=>{
    if (err.isOperational) {     
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        });
    }else{
        res.status(500).json({
            status:'error',
            message: 'Internal server error!'
        })
    }
}

// global error handling
module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(res, err);
    }else if(process.env.NODE_ENV === 'production'){
        if(err.name === 'CastError') err = castErrorHandler(err);
        if(err.code === 11000) err = duplicateKeyErrorHandler(err);
        if (err.name === 'ValidationError') err = validationErrorHandler(err);
        if (err.name === 'TokenExpiredError') err = handleExpiredJWT(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError(err);

        prodErrors(res, err);
    }

    res.status(err.statusCode).json({
        status:err.statusCode,
        message:err.message
    });
}