const models = require('../../models/index');
const movie = models.movie;
const Gerne = models.gerne;
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


module.exports.filterMovies = async (req, res) => {
  const { year, gerne, country } = req.query;

  try {
    const movies = await movie.findAll({
      where: {
        release: {
          [Op.between]: [year ? `${year}-01-01` : '0001-01-01', year ? `${year}-12-31` : '9999-12-31']
        }
      },
      include: [
        {
          model: producer,
          where: {
            country: country || { [Op.ne]: null }
          }
        },
        {
          model: Gerne,
          where: {
            name: gerne || { [Op.ne]: null }
          }
        }
      ]
    });
    res.render('movie/movies', { title: 'All Movies', movies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /search
module.exports.search = async (req, res) => {
  const { keyword } = req.query;
  try {
    const results = await movie.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`
        }
      }
    });
    res.render('movie/movies', {
      title: 'Search Results',
      results: results || [] 
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};