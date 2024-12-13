const Post = require('../Models/Post');
const ApiFeatures = require('./../utils/ApiFeatures');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');

exports.getAllPosts = asyncErrorHandler(async(req,res, next)=>{
    const features = new ApiFeatures(Post.find(), req.query).pagination();
    let posts = await features.query;

    res.status(200).json({
        status:"success",
        length: posts.length,
        data:{
            posts
        }
    });
});

exports.createPost = asyncErrorHandler(async(req, res, next)=>{
    const post = await Post.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            post
        }
    })
})

exports.updatePost = asyncErrorHandler(async(req, res, next)=>{
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});

    if (!updatedPost) {
        const error = new CustomError('Post with the ID is not found!',404);
        return next(error); 
    }

    res.status(200).json({
        status:'success',
        data:{
            post: updatedPost
        }
    })
})

exports.deletePost = asyncErrorHandler(async (req, res, next)=>{
    const deletePost = await Post.findByIdAndDelete(req.params.id);

    if (!deletePost) {
        const error = new CustomError('Post with the ID is not found!',404);
        return next(error); 
    }
    
    res.status(204).json({
        status:'success',
        data:null
    })
})