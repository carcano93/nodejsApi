const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const auth = jwt({
    requestProperty:'payload',
    secret: process.env.JWT_SECRET,
    algorithms:['sha1', 'RS256', 'HS256']
})
const controller = require('../controllers/games');

router.route('/')
    .get(controller.gamesGetAll)
    .post(auth, controller.gamesAddOne)

router.route('/:gameId')
    .get(controller.gamesGetOne)

//reviews
router.route('/:gameId/reviews/')
    .post(auth, controller.reviewsAddOne)

router.route('/:gameId/reviews/:reviewId')
    .get( controller.reviewsGetOne)
    .delete(auth, controller.reviewDeleteOne)
    .put(auth, controller.reviewUpdateOne)

module.exports = router;
