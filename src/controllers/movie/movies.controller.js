const models = require('../../models/index');
const movie = models.movie;
const gerne = models.gerne;
const category = models.category;
const producer = models.producer;
const { Op } = require('sequelize');

module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await movie.findAll({
      order: [['create_at', 'DESC']]
    });

    res.render('movie/movies', { title: 'All Movies', movies});

  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};