const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name:{
        type: String,
        required: [true, 'Category name is required.'],
        unique: true,
        maxlength:[100, "max 100 characters only"],
        minlength:[4,"min 4 characters only"],
        trim: true,
    },
    description:{
        type: String,
    },
    is_active:{
        type: Boolean,
        default: true
    },
    image_data:{
        type: String,
    },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;