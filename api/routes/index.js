const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');

router.route('/').get(controller.indexInfo);

module.exports = router;
