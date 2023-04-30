const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie/movies.controller');
const controller = require('../controllers/home.controller');

router.get('/', movieController.getAllMovies);
router.get('/filter', movieController.filterMovies);
router.get('/search', controller.search);


module.exports = router;