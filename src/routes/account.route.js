const express = require("express");
const router = express.Router();
const models = require('../models/index');

const WatchList = models.watch_list;

const authController = require("../controllers/account/auth.controller");
const userController = require("../controllers/account/user.controller");
const verifySignUp = require("../middlewares/verifySignUp");
const { verifyToken, isAdmin, isUser } = require("../middlewares/authJwt");

router.get("/signup", userController.signUp);
router.get("/signin", userController.signIn);
router.get("/signout", authController.signout);
router.post("/signup", verifySignUp, authController.signup);
router.post("/signin", authController.signin);

router.get("/profile", verifyToken, userController.profile);
router.get("/watch_list", [verifyToken, isUser], userController.watchList);
router.post("/profile", userController.postProfile);
router.get('/watch_list/:movieId/remove', verifyToken, async (req, res) => {
    try {
      const watchlist = await WatchList.findOne({ where: { user_id: req.userId } });
  
      if (!watchlist) {
        return res.status(400).json({ message: "Watchlist not found" });
      }
  
      await watchlist.removeMovie(req.params.movieId);
  
      res.redirect("/account/watch_list");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
