const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required.'],
        unique: true,
        maxlength:[100, "max 100 characters only"],
        minlength:[4,"min 4 characters only"],
        trim: true,
    },
    description:{
        type: String,
        // required: [true, 'Description is required.'],
    },
    duration:{
        type: Number,
        // required:[true, 'Duration is required.']
    },
    ratings:{
        type:Number,
        default:0.0,
        min:[1, "Rating must be 1 or above."],
        max:[5, "Rating must be 5 or below."]
    },
    totalRating:{
        type: Number,
    },
    releaseYear:{
        type: Number,
        // required:[true, 'Release year is required.']
    },
    releaseDate:{
        type: Date,
        default: Date.now()
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    genres:{
        type:[String],
        required: [true, 'Genres is required.'],
        enum:{
            values:['Action',"Comady","Thrilled","Advanture"],
            message:"This genre does not exist."
        }
    },
    directors:{
        type: [String],
        required: [true, 'Directors is required.']
    },
    coverImage:{
        type: [String],
        required: [true, 'Cover image is required.']
    },
    actors:{
        type: [String],
        required: [true, 'Actors is required.']
    },
    price:{
        type:Number,
        // required: [true, 'Price is required.']
    }
});

// movieSchema.pre('save',function (next) {
//     this.createdBy = 'MANISH BAGHEL';
//     next();
// });

// movieSchema.post('save',function (doc, next) {
//     next();
// })

movieSchema.pre('find',function (next) {
    this.find({releaseDate:{$lte: Date.now()}});
    next();
})

// movieSchema.post(/^find/,function (next) {
//     this.find({releaseDate:{$lte: Date.now()}});
//     next();
// })

// movieSchema.pre('aggregate',function (next) {
//     console.log(this.pipeline().unshift({$match:{releaseDate:{$lte:new Date()}}}));
//     next();
// })

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;