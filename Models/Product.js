const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name:{
        type: String,
        required: [true, 'Product name is required.'],
        unique: true,
        maxlength:[100, "max 100 characters only"],
        minlength:[4,"min 4 characters only"],
        trim: true,
    },
    description:{
        type: String,
    },
    categories:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, 'Category is required.'],
        }
    ],
    barcode:{
        type: String,
    },
    sku:{
        type: String,
    },
    price:{
        type: Number,
    },
    discount:{
        type: Number,
    },
    brand:{
        type: String,
    },
    product_image:{
        type: [String],
    },
    tags:{
        type: [String],
    },
    is_active:{
        type: Boolean,
        default: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{ timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;