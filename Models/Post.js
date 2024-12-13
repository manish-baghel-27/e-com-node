const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Post title is required.'],
        unique: true,
        maxlength:[100, "max 100 characters only"],
        minlength:[4,"min 4 characters only"],
        trim: true,
    },
    description:{
        type: String,
    },
    post_image:{
        type: [String],
    },
    is_active:{
        type: Boolean,
        default: true
    },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;