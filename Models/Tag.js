const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Tag name is required.'],
        unique: true,
        maxlength:[100, "max 100 characters only"],
        minlength:[1,"min 1 characters only"],
        trim: true,
    },
    description:{
        type: String,
    },
    is_active:{
        type: Boolean,
        default: true
    }
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;