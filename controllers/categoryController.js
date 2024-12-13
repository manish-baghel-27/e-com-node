const Category = require('../Models/Category');
const ApiFeatures = require('./../utils/ApiFeatures');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');


exports.getAllCategories = asyncErrorHandler(async(req,res, next)=>{
    const features = new ApiFeatures(Category.find(), req.query).pagination();
    let categories = await features.query;

    res.status(200).json({
        status:"success",
        length: categories.length,
        data:{
            categories
        }
    });
});

exports.getCategory = asyncErrorHandler(async(req, res, next)=>{
    const category = await Category.findById(req.params.id);

    if (!category) {
       const error = new CustomError('Category with the ID is not found!',404);
       return next(error); 
    }

    res.status(200).json({
        status:"success",
        data:{
            category
        }
    });
})

exports.createCategory = asyncErrorHandler(async(req,res, next)=>{
    const category = await Category.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            category
        }
    })
})

exports.updateCategory = asyncErrorHandler(async(req, res, next)=>{
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});

    if (!updatedCategory) {
        const error = new CustomError('Category with the ID is not found!',404);
        return next(error);
    }

    res.status(200).json({
        status:'success',
        data:{
            category: updatedCategory
        }
    })
})

exports.deleteCategory = asyncErrorHandler(async (req, res, next)=>{
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deleteCategory) {
        const error = new CustomError('Category with the ID is not found!',404);
        return next(error); 
    }
    
    res.status(204).json({
        status:'success',
        data:null
    })
})