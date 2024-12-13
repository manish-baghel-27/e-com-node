// const fs = require('fs');
const Movie = require('../Models/Movie');
const ApiFeatures = require('./../utils/ApiFeatures');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');
// let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

exports.getHigestRated = (req, res, next)=>{
    req.query.limit ='5';
    req.query.sort = '-ratings';
    next();
}

exports.getAllMovies= asyncErrorHandler(async(req,res, next)=>{
    const features = new ApiFeatures(Movie.find(), req.query).pagination();
    let movies = await features.query;

    res.status(200).json({
        status:"success",
        length: movies.length,
        data:{
            movies
        }
    });
});

exports.getMovie = asyncErrorHandler(async(req, res, next)=>{
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
       const error = new CustomError('Movie with the ID is not found!',404);
       return next(error); 
    }

    res.status(200).json({
        status:"success",
        data:{
            movie
        }
    });
})

exports.createMovie = asyncErrorHandler(async(req,res, next)=>{
    const movie = await Movie.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            movie
        }
    })
})

exports.updateMovie = asyncErrorHandler(async(req, res, next)=>{
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});

    if (!updatedMovie) {
        const error = new CustomError('Movie with the ID is not found!',404);
        return next(error); 
    }

    res.status(200).json({
        status:'success',
        data:{
            movie: updatedMovie
        }
    })
})

exports.deleteMovie = asyncErrorHandler(async (req, res, next)=>{
    const deleteMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deleteMovie) {
        const error = new CustomError('Movie with the ID is not found!',404);
        return next(error); 
    }
    
    res.status(204).json({
        status:'success',
        data:null
    })
})

exports.getMovieStats = asyncErrorHandler(async(req, res, next)=>{
    const stats = await Movie.aggregate([
        {$match:{ratings:{$gte:0}}},
        {
            $group:{
                _id:'$releaseYear',
                avgRating:{$avg: '$ratings'},
                totalPrice:{$sum: '$price'}
            }
        },
        {
            $sort:{totalPrice:1}
        },
        {
            $match:{totalPrice:{$gte:0}}
        }
    ]);
    res.status(200).json({
        status:'success',
        count:stats.length,
        data:{
            stats
        }
    })
})

exports.getMovieByGenre = asyncErrorHandler(async(req, res, next)=>{
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
        {$unwind: '$genres'},
        {$group:{
            _id:"$genres",
            movieCount:{$sum:1},
            movies:{$push: '$name'}
        }},
        {$addFields:{genre:"$_id"}},
        {$project:{_id:0}},
        {$sort:{movieCount:-1}},
        {$match:{genre:genre}}
    ]);
    res.status(200).json({
        status:'success',
        count:movies.length,
        data:{
            movies
        }
    })
})