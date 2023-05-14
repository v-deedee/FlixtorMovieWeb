const { Op } = require("sequelize");
const models = require("../../models/index");
const Movie = models.movie;
const Actor = models.actor;
const Cast = models.cast;
const Director = models.director;
const Producer = models.producer;
const Gener = models.gerne;
const Category = models.category;
const Sequelize = models.sequelize;

module.exports.showMovies = async (req, res) => {
  const movieList = await Movie.findAll({
    attributes: [
      "id",
      "title",
      "description",
      "rating",
      "duration",
      "image",
      "video",
      "release",
    ],
    include: [
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
        attributes: ["full_name"],
      },
      {
        model: Gener,
        attributes: ["name"],
      },
    ],
    raw: true,
  });

  //   userList.forEach((user) => {
  //     console.log(user);
  //     console.log(user.user_name);
  //   });
  res.render("management/manage_movie", { title: "Manage Movies", movieList });
};

module.exports.postDeleteMovie = async (req, res) => {
  try {
    const deleteIds = req.body.deleteIds;
    await Movie.destroy({
      where: {
        id: {
          [Op.in]: deleteIds,
        },
      },
    });

    res.status(200).json({ message: "Deleted." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.postUpdateMovie = async (req, res) => {
  try {
    await Movie.update(
      {
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
        duartion: req.body.duartion,
        release: req.body.release,
        update_at: Sequelize.literal("NOW()"),
      },
      {
        where: {
          id: req.body.updateId,
        },
      }
    );

    res.status(200).json({ message: "Success." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.postAddMovie = async (req, res) => {
  try {
    // tìm/tạo actor
    const actorIds = [];
    for (const actorName of req.body.actorList) {
      const [actor, created] = await Actor.findOrCreate({
        where: { name: actorName },
        defaults: {},
      });
      actorIds.push(actor.id);
    }

    // tìm/tạo genre
    const genreIds = [];
    for (const genreName of req.body.genreList) {
      const [genre, created] = await Actor.findOrCreate({
        where: { name: genreName },
        defaults: {},
      });
      genreIds.push(genre.id);
    }

    // tìm/tạo director
    const [director, createdDirector] = await Director.findOrCreate({
      where: { name: req.body.director },
      defaults: {},
    });

    // tìm/tạo producer
    const [producer, createdProducer] = await Producer.findOrCreate({
      where: { name: req.body.producer },
      defaults: {},
    });

    // tạo film
    const movie = await Movie.create({
      title: req.body.title,
      description: req.body.description,
      rating: req.body.rating,
      duartion: req.body.duartion,
      release: req.body.release,
      image: req.files.image ? req.files.image[0].filename : null,
      video: req.files.video ? req.files.video[0].filename : null,
      director: director.id,
      producer: producer.id,
      create_at: Sequelize.literal("NOW()"),
    });

    // tạo cast
    for (const actorId of actorIds) {
      await Cast.create({
        actor_id: actorId,
        movie_id: movie.id,
      });
    }

    // tạo category
    for (const genreId of genreIds) {
      await Category.create({
        genre_id: genreId,
        movie_id: movie.id,
      });
    }

    res.status(200).json({ message: "Success." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
