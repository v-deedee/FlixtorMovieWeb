const express = require('express');
const router = express.Router();

const controller = require('../controllers/account.controller');

router.get('/profile', controller.profile);
router.get('/watch_list', controller.watchList);
router.get('/register', controller.register);
router.get('/login', controller.login);

module.exports = router;