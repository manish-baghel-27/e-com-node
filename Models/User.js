const { default: mongoose } = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'Name field is required.']
    },
    email:{
        type: String,
        required:[true, 'Email field is required.'],
        unique: true,
        lowercase:true,
        validate:[validator.isEmail, 'Please enter a valid email.']
    },
    photo: String,
    role:{
        type: String,
        enum:['user', 'admin', 'superadmin'],
        default:'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select:false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate:{
            validator:function (val) {
                return val == this.password;
            },
            message:'Confirm Password does not match.',
        }
    },
    isDeleted:{
        type: Boolean,
        default: false,
        select: false
    },
    passwordChangedAt:Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    
    // encrypt the password before saving it
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
})

userSchema.pre(/^find/, function (next) {
    // this keyword in the function, will point to current query
    this.find({isDeleted: {$ne: true}});
    next();
})

userSchema.methods.comparePasswordInDb = async function(password, DBPassword){
    return await bcrypt.compare(password, DBPassword);
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if (this.passwordChangedAt) {
        const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return (JWTTimestamp < pswdChangedTimestamp);
    }
    return false;
}

userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + (10 * 60 * 1000)//in miliseconds (10 miniuts);

    return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;