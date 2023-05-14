const express = require("express");
const router = express.Router();
const multer = require("multer");

const authController = require("../controllers/account/auth.controller");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");
const manageUserController = require("../controllers/management/manage.user.controller");
const manageMovieController = require("../controllers/management/manage.movie.controller");
const manageCommentController = require("../controllers/management/manage.comment.controller");

router.get("/users", [verifyToken, isAdmin], manageUserController.showUsers);
router.get("/movies", [verifyToken, isAdmin], manageMovieController.showMovies);
router.get(
  "/comments",
  [verifyToken, isAdmin],
  manageCommentController.showComments
);
router.post("/users", manageUserController.postManageUsers);

// Khởi tạo storage để lưu file vào thư mục /public/images và /public/videos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "public/images");
    } else if (file.fieldname === "video") {
      cb(null, "public/videos");
    }
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});
// Khởi tạo middleware multer với storage đã được cấu hình
const upload = multer({ storage: storage });

router.post(
  "/movies/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  manageMovieController.postAddMovie
);
router.post("/movies/update", manageMovieController.postUpdateMovie);
router.post("/movies/delete", manageMovieController.postDeleteMovie);
router.post("/comments", manageCommentController.postManageComments);

module.exports = router;
