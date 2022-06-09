const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

router.route('/login')
    .post(controller.login);
    
router.route('/register')
    .post(controller.register);

module.exports = router;
