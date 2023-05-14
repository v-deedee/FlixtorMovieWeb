const models = require('../../models/index');
const Movie = models.movie;
const Gerne = models.gerne;
const Category = models.category;
const Producer = models.producer;
const User = models.user;
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports.getAllMovies = async (req, res) => {
  try {
    if (!req.session.token) {
      const movies = await Movie.findAll();
      return res.render('movie/movies', { title: 'All Movies', movies});
    }
    jwt.verify(req.session.token, authConfig.secret, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }

      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "user_name"],
      });

      if (!user) {
        return res.status(403).json({
          message: "Invalid user!",
        });
      }

      const movies = await Movie.findAll();

      res.render('movie/movies', { title: 'All Movies', movies, user, verified: true});
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};


function getReleaseDateBetween(year) {
  if (!year) {
    return [ '0001-01-01', '9999-12-31' ];
  }
  if (year.endsWith('s')) {
    const startYear = parseInt(year.slice(0, 4));
    const endYear = startYear + 9;
    return [`${startYear}-01-01`, `${endYear}-12-31`];
  }
  return [`${year}-01-01`, `${year}-12-31`];
}

module.exports.filterMovies = async (req, res) => {
  try {
    if (!req.session.token) {
      const { year, gerne, country } = req.query;
      const sort = req.query.sort;
      let sortOption = {};

      switch (sort) {
        case 'create_at':
          sortOption = [['create_at', 'DESC']];
          break;
        case 'release':
          sortOption = [['release', 'DESC']];
          break;
        case 'title':
          sortOption = [['title', 'ASC']];
          break;
        case 'rating':
          sortOption = [['rating', 'DESC']];
          break;
        default:
          sortOption = [];
      }
      const movies = await Movie.findAll({
        where: {
          release: {
            [Op.between]: getReleaseDateBetween(year)
          }
        },
        include: [
          {
            model: Producer,
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
        ],
        order: sortOption
      });
      return res.render('movie/movies', { title: 'Filtered Movies', movies })
    };
    jwt.verify(req.session.token, authConfig.secret, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }

      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "user_name"],
      });

      if (!user) {
        return res.status(403).json({
          message: "Invalid user!",
        });
      }

      const { year, gerne, country } = req.query;
      const sort = req.query.sort;
      let sortOption = {};

      switch (sort) {
        case 'create_at':
          sortOption = [['create_at', 'DESC']];
          break;
        case 'release':
          sortOption = [['release', 'DESC']];
          break;
        case 'title':
          sortOption = [['title', 'ASC']];
          break;
        case 'rating':
          sortOption = [['rating', 'DESC']];
          break;
        default:
          sortOption = [];
      }
        const movies = await Movie.findAll({
          where: {
            release: {
              [Op.between]: getReleaseDateBetween(year)
            }
          },
          include: [
            {
              model: Producer,
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
          ],
          order: sortOption
        });
        res.render('movie/movies', { title: 'Filtered Movies', movies, user, verified: true});
    }); 
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// GET /search
module.exports.search = async (req, res) => {
  try {
    if (!req.session.token) {
      const { keyword } = req.query;
      const results = await Movie.findAll({
        where: {
          title: {
            [Op.like]: `%${keyword}%`
          }
        }
      });
      return res.render('movie/movies', {
        title: 'Search Results',
        results: results || [],
        keyword
      });
    }
    jwt.verify(req.session.token, authConfig.secret, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }

      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "user_name"],
      });

      if (!user) {
        return res.status(403).json({
          message: "Invalid user!",
        });
      }

      const { keyword } = req.query;
      const results = await Movie.findAll({
        where: {
          title: {
            [Op.like]: `%${keyword}%`
          }
        }
      });
      res.render('movie/movies', { title: 'Search Results',
      results: results || [], user, verified: true, keyword});
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};