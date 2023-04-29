const express = require('express');
const router = express.Router();

const controller = require('../controllers/home.controller');
const { verifyToken } = require('../middlewares/authJwt');

router.get('/', verifyToken, controller.home);
router.get('/guest', controller.home);
router.get('/search', controller.search);

module.exports = router;