const models = require('../../models/index');
const Movie = models.movie;
const Gerne = models.gerne;
const Category = models.category;
const Producer = models.producer;
const User = models.user;
const Comment = models.comment;
const Director = models.director;
const Actor = models.actor;
const WatchList = models.watch_list;
const MovieList = models.movie_list;
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports.showMovie = async (req, res) => {
    try {
      if (!req.session.token) {
        const movieId = req.params.id;
        const movie = await Movie.findByPk(movieId, {
          include: [
            {
              model: Gerne,
            },
            {
              model: Director,
              attributes: ["full_name"],
            },
            {
              model: Producer,
              attributes: ["name", "country"],
            },
            {
              model: Actor,
              attributes: ["full_name"]
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
        return res.render('movie/watch', { movie, comments, relatedMovies });
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

        const movieId = req.params.id;
        const movie = await Movie.findByPk(movieId, {
          include: [
            {
              model: Gerne,
            },
            {
              model: Director,
              attributes: ["full_name"],
            },
            {
              model: Producer,
              attributes: ["name", "country"],
            },
            {
              model: Actor,
              attributes: ["full_name"]
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
        res.render('movie/watch', { movie, comments, relatedMovies, user, verified: true });
      });
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

module.exports.addToWatchList = async (req, res) => {
  try {

    // Lấy thông tin user từ database
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Lấy thông tin phim từ database
    const movieId = req.params.id;
    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const watchList_check = await WatchList.findOne({
      where: {
        user_id: req.userId,
      },
      include: {
        model: Movie,
        where: {
          id: movieId,
        },
      },
    });
    
    if (watchList_check) {
      return res.status(400).json({
        message: "Movie already added to watchlist",
      });
    }
    
    // Tìm danh sách xem của người dùng
    const watchList = await WatchList.findOne({
      where: {
        user_id: req.userId,
      },
    });
    
    if (!watchList) {
      return res.status(404).json({
        message: "Watchlist not found",
      });
    }
    
    // Thêm phim vào danh sách xem
    await watchList.addMovie(movieId);
    

    res.redirect(`/account/watch_list`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};




