const express = require('express');
const router = express.Router();
const moviesController = require('./../controllers/moviesController');
const authController = require('./../controllers/authController');

router.route('/higest-rated').get(moviesController.getHigestRated, moviesController.getAllMovies);
router.route('/movie-stats').get(moviesController.getMovieStats);
router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);

router.route('/')
    .get(authController.protect, moviesController.getAllMovies)
    .post(authController.protect, moviesController.createMovie)

router.route('/:id')
.get(moviesController.getMovie)
.patch(moviesController.updateMovie)
.delete(authController.protect, authController.restrict('admin', 'superadmin'), moviesController.deleteMovie)

module.exports = router;