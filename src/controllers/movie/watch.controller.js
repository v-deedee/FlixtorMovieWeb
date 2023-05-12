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
          ],
          order: [['create_at', 'DESC']]
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
    if (!req.session.token) {
      return res.status(401).json({
        message: "Please sign in before commenting!",
      });
    }
    jwt.verify(req.session.token, authConfig.secret, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }

      const movieId = req.params.id;
      const userId = decoded.id;
      
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({
          message: "Movie not found",
        });
      }

      await Comment.create({
        content: req.body.content,
        violate: 0,
        user_id: userId,
        movie_id: movieId,
        create_at: new Date(),
      });

      return res.status(200).json({
        message: "Comment added successfully!",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports.addToWatchList = async (req, res) => {
  try {
    if (!req.session.token) {
      return res.status(401).json({
        message: "Please sign in before adding movie to watchlist!",
      });
    }
    jwt.verify(req.session.token, authConfig.secret, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }

      const user = await User.findByPk(decoded.id);

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
          user_id: decoded.id,
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
          message: "This movie already added to your watchlist!",
        });
      }

      // Tìm danh sách xem của người dùng
      const watchList = await WatchList.findOne({
        where: {
          user_id: decoded.id,
        },
      });

      if (!watchList) {
        return res.status(404).json({
          message: "Watchlist not found",
        });
      }

      // Thêm phim vào danh sách xem
      await watchList.addMovie(movieId);

      res.status(200).json({
        message: "Movie added to your watchlist!",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};


