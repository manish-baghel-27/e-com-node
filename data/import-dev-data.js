const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const fs = require('fs');
const Movie = require('./../Models/Movie');


mongoose.connect(process.env.CONN_STR,
    {useNewUrlParser:true}
).then((conn)=>{
    console.log('DB Connection Successfull.');
}).catch((err)=>{
    console.log(err);
});

// read movies.json file
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

// delete existing movie documents from collection
const deleteMovies = async ()=>{
    try {
        await Movie.deleteMany();
        console.log('Deleted');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

const importMovies = async ()=>{
    try {
        await Movie.create(movies);
        console.log('imported');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importMovies();
}
if (process.argv[2] === '--delete') {
    deleteMovies();
}