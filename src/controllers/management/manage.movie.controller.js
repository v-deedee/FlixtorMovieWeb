const { Op } = require("sequelize");
const models = require("../../models/index");
const Movie = models.movie;
const Actor = models.actor;
const Director = models.director;
const Producer = models.producer;
const Gener = models.gerne;
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
    ],
    raw: true,
  });

  //   userList.forEach((user) => {
  //     console.log(user);
  //     console.log(user.user_name);
  //   });
  res.render("management/manage_user", { title: "Manage Users", userList });
};
