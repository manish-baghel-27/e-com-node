const Tag = require('../Models/Tag');
const ApiFeatures = require('./../utils/ApiFeatures');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');


exports.getTags = asyncErrorHandler(async(req,res, next)=>{
    const features = new ApiFeatures(Tag.find(), req.query).pagination();
    let tags = await features.query;

    res.status(200).json({
        status:"success",
        length: tags.length,
        data:{
            tags
        }
    });
});

exports.createTag = asyncErrorHandler(async(req,res, next)=>{
    const tag = await Tag.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            tag
        }
    })
})

exports.updateTag = asyncErrorHandler(async(req, res, next)=>{
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});

    if (!updatedTag) {
        const error = new CustomError('Tag with the ID is not found!',404);
        return next(error);
    }

    res.status(200).json({
        status:'success',
        data:{
            tag: updatedTag
        }
    })
})

exports.deleteTag = asyncErrorHandler(async (req, res, next)=>{
    const deleteTag = await Tag.findByIdAndDelete(req.params.id);

    if (!deleteTag) {
        const error = new CustomError('Tag with the ID is not found!',404);
        return next(error); 
    }
    
    res.status(204).json({
        status:'success',
        data:null
    })
})