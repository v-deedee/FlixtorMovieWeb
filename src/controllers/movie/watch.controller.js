const models = require('../../models/index');
const Movie = models.movie;
const Gerne = models.gerne;
const Category = models.category;
const Producer = models.producer;
const User = models.user;
const Comment = models.comment;
const { Op } = require('sequelize');

module.exports.showMovie = async (req, res) => {
    try {
      const movieId = req.params.id;
      const movie = await Movie.findByPk(movieId, {
        include: [
          {
            model: Gerne,
          }
        ]
      });
  
      if (!movie) {
        return res.status(404).send('Movie not found');
      }

      const genreNames = movie.gernes.map(g => g.name);

      const relatedMovies = await Movie.findAll({
        where: {
          id: {
            [Op.ne]: movieId
          }
        },
        include: [
          {
            model: Gerne,
            where: {
              name: {
                [Op.in]: genreNames
              }
            }
          }
        ]
      });
      
      // Hiển thị comment và form để viết comment
    const comments = await Comment.findAll({
      where: {
        movie_id: movieId
      },
      include: [
        {
          model: User,
          attributes: ['user_name'],
        }
      ]
    });
  
      res.render('movie/watch', { movie, comments, relatedMovies });
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  };

  // Module hiển thị comment
module.exports.showComments = async (req, res) => {
  try {
    const movieId = req.params.id;
    const comments = await Comment.findAll({
      where: {
        movie_id: movieId
      },
      include: [
        {
          model: User,
          attributes: ['user_name']
        }
      ]
    });

    res.render('movie/watch', { comments });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// Module viết comment
module.exports.writeComment = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.userId;
    
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    await Comment.create({
      content: req.body.content,
      violate: 0,
      user_id: userId,
      movie_id: movieId,
      create_at: new Date(),
    });

    res.redirect(`/movie/${movieId}`);
  } catch (err) {
    console.log(err);
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err.errors[0].message);
    } else if (err.name === 'UnauthorizedError') {
      res.status(401).send(err.message);
    } else {
      res.status(500).send('Server Error');
    }
  }
};





