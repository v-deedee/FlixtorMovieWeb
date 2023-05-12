const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie/movies.controller');
const topIMDbController = require('../controllers/movie/topIMDb.controller');
const gerneController = require('../controllers/movie/gerne.controller');
const watchController = require('../controllers/movie/watch.controller');

router.get('/movies', movieController.getAllMovies);
router.get('/topIMDb', topIMDbController.getAlltopIMDb)
router.get('/genre/:genre', gerneController.getAllMoviesByGenre)
router.get('/filter', movieController.filterMovies);
router.get('/search', movieController.search);
router.get('/:id', watchController.showMovie);
router.post('/:id/comment', watchController.writeComment);
router.post('/:id/watchlist', watchController.addToWatchList);

module.exports = router;
