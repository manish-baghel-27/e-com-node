const Product = require('../Models/Product');
const ApiFeatures = require('./../utils/ApiFeatures');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');

exports.getAllProducts = asyncErrorHandler(async(req, res, next)=>{
    const features = new ApiFeatures(Product.aggregate([
        {
            $lookup:{
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "related_categories"
            }
        },
        {
            $lookup:
            {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "related_tags"
            }
        }
    ]), req.query).pagination();
    
    let products = await features.query;
    
    res.status(200).json({
        status: "success",
        length: products.length,
        data:{
            products
        }
    });
});

productWithAggregation = async(product) =>{
    return Product.aggregate([
        {
            $match:{
                _id: product._id
            }
        },{
            $lookup:{
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "related_categories"
            }
        }
    ]);
};

exports.createProduct = asyncErrorHandler(async(req, res, next)=>{
    let getProduct ={...req.body, categories: JSON.parse(req.body.categories)};
    getProduct ={...getProduct, tags: JSON.parse(req.body.tags)};

    const product = await Product.create(getProduct);
    const product_with_aggregation = await productWithAggregation(product);

    res.status(201).json({
        status:'success',
        data:{
            product: product_with_aggregation
        }
    })
})

exports.updateProduct = asyncErrorHandler(async(req, res, next)=>{
    let getProduct ={...req.body, categories: JSON.parse(req.body.categories)};
    getProduct = {...getProduct, tags: JSON.parse(req.body.tags)};

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, getProduct, {new: true, runValidators:true});

    if (!updatedProduct) {
        const error = new CustomError('Product with the ID is not found!',404);
        return next(error); 
    }

    const product = await productWithAggregation(updatedProduct);

    res.status(200).json({
        status:'success',
        data:{
            product
        }
    })
})

exports.deleteProduct = asyncErrorHandler(async (req, res, next)=>{
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
        const error = new CustomError('Product with the ID is not found!',404);
        return next(error); 
    }
    
    res.status(204).json({
        status:'success',
        data:null
    })
})