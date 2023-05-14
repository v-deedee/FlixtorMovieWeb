const { Op } = require("sequelize");
const models = require("../../models/index");
const User = models.user;
const Sequelize = models.sequelize;

const banValue = 5;

module.exports.showUsers = async (req, res) => {
  const admin = await User.findByPk(req.userId, {
    attributes: ["id", "user_name", "email", "password", "role"],
  });

  const userList = await User.findAll({
    attributes: ["id", "user_name", "email", "role", "ban"],
    raw: true,
  });

  //   userList.forEach((user) => {
  //     console.log(user);
  //     console.log(user.user_name);
  //   });
  res.render("management/manage_user", {
    title: "Manage Users",
    userList,
    admin,
  });
};

module.exports.postManageUsers = async (req, res) => {
  try {
    if (typeof req.body.deleteIds !== "undefined") {
      const deleteIds = req.body.deleteIds;
      await User.destroy({
        where: {
          id: {
            [Op.in]: deleteIds,
          },
          ban: {
            [Op.gte]: banValue,
          },
        },
      });
    }

    if (typeof req.body.makeAdminIds !== "undefined") {
      const makeAdminIds = req.body.makeAdminIds;
      await User.update(
        { role: "admin", ban: 0 },
        {
          where: {
            id: {
              [Op.in]: makeAdminIds,
            },
          },
        }
      );
    }

    res.status(200).json({ message: "Success." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
