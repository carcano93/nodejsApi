const mongose = require('mongoose');
const Games = mongose.model('Games');

const gamesGetAll = (req, res) => {
    Games
        .find({}, { __v: 0 })
        .select('name company -reviews -userId -userName')
        .exec((err, allGames) => {
            if (!allGames) {
                return res
                    .status(404)
                    .json({ 'message': 'there is no one game' });
            } else if (err) {
                return res
                    .status(400)
                    .json({ err: err.message });
            }
            res
                .status(200)
                .json(allGames);
        });
}

const gamesGetOne = (req, res) => {
    Games
        .findById(req.params.gameId, { __v: 0 })
        .select('-userId -userName -reviews.userId -reviews._id')
        .exec((err, game) => {
            if (!game) {
                return res
                    .status(404)
                    .json({ 'message': 'Game not fond' });
            } else if (err) {
                return res
                    .status(400)
                    .json({ err: err.message });
            }

            res
                .status(200)
                .json(game);
        });
}

const reviewsGetOne = (req, res) => {
    Games
        .findById(req.params.gameId)
        .select('-reviews.userId')
        .exec((err, game) => {
            if (!game) {
                return res
                    .status(404)
                    .json({ 'message': 'Game not found' });
            } else if (err) {
                return res
                    .status(400)
                    .json({ err: err.message });
            }
            if (game.reviews && game.reviews.length > 0) {
                const review = game.reviews.id(req.params.reviewId);
                if (!review) {
                    return res
                        .status(404)
                        .json({ 'message': 'Review not found' });
                } else {
                    let response = {
                        game: {
                            id: game._id
                        },
                        review
                    }
                    res
                        .status(200)
                        .json(response);
                }
            } else {
                return res
                    .status(400)
                    .json({ 'message': 'No reviews found' });
            }
        });
}

const gamesAddOne = (req, res) => {
    Games
        .create({
            company: req.body.company,
            userName: req.payload.name,
            name: req.body.name,
            userId: req.payload._id

        }, (err, game) => {
            if (err) {
                res
                    .status(400)
                    .json({ err: err.message });
            } else {
                res
                    .status(200)
                    .json({ id: game._id });
            }
        });
}

const reviewsAddOne = (req, res) => {
    const gameId = req.params.gameId;
    if (gameId) {
        Games
            .findById(gameId)
            .select('name reviews')
            .exec((err, game) => {
                if (err) {
                    res
                        .status(400)
                        .json({ err: err.message });
                } else {
                    doReviewsAddOne(req, res, game);
                }
            });
    } else {
        res
            .status(400)
            .json({ 'message': 'Game not found' });
    }
}

const doReviewsAddOne = (req, res, game) => {
    if (game) {
        game.reviews.push({
            comment: req.body.comment,
            rating: req.body.rating,
            userName: req.payload.name,
            userId: req.payload._id

        });
        game.save((err, game) => {
            if (err) {
                res
                    .status(400)
                    .json({ 'err': err.message });
            } else {
                updateAverageRating(game);
                res
                    .status(200)
                    .json({ id: game.reviews.slice(-1).pop()._id });
            }
        })
    } else {
        res
            .status(404)
            .json({ 'message': 'Game not found' });
    }
}

const reviewUpdateOne = (req, res) => {

    Games
        .findById({ _id: req.params.gameId })
        .exec((err, game) => {
            if (!game) {
                return res
                    .status(404)
                    .json({ 'message': 'Game not found' });
            } else if (err) {
                return res
                    .status(400)
                    .json({ err: err.message });
            }
            if (game.reviews && game.reviews.length > 0) {
                const review = game.reviews.id(req.params.reviewId);
                if (!review) {
                    return res
                        .status(404)
                        .json({ 'message': 'Review not found' });
                } else {

                    if (review.userId === req.payload._id) {
                        review.comment = req.body.comment;
                        review.rating = req.body.rating
                        game.save((err, game) => {
                            if (err) {
                                res
                                    .status(400)
                                    .json({ 'err': err.message });
                            } else {
                                updateAverageRating(game);
                                res
                                    .status(200)
                                    .json({
                                        userName: review.userName,
                                        comment: review.comment,
                                        rating: review.rating
                                    });
                            }
                        })
                    } else {
                        res
                            .status(401)
                            .json({ 'message': 'Unauthorized user' });
                    }
                }
            } else {
                return res
                    .status(400)
                    .json({ 'message': 'No reviews found' });
            }
        });
}

const reviewDeleteOne = (req, res) => {
    const { gameId, reviewId } = req.params;
    Games
        .findById(gameId)
        .exec((err, game) => {
            if (!game) {
                return res
                    .status(404)
                    .json({ 'message': 'Game not found' });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            if (game.reviews && game.reviews.length > 0) {
                if (!game.reviews.id(req.params.reviewId)) {
                    return res
                        .status(404)
                        .json({ 'message': 'Review not found' });
                } else {
                    const review = game.reviews.id(reviewId);
                    if (review.userId === req.payload._id) {
                        review.remove();
                        game.save((err, game) => {
                            if (err) {
                                res
                                    .status(400)
                                    .json({ 'err': err.message });
                            } else {
                                updateAverageRating(game);
                                res
                                    .status(204)
                                    .json(null);
                            }
                        });
                    } else {
                        res
                            .status(401)
                            .json({ 'message': 'Unauthorized user' });
                    }
                }
            } else {
                return res
                    .status(400)
                    .json({ 'message': 'No reviews to delete' });
            }
        });
}

const updateAverageRating = (game) => {
    const count = game.reviews.length;
    if (game.reviews && count > 0) {
        let total = game.reviews.reduce((sum, current) => { return sum + current.rating }, 0)
        game.averageRating = (total / count).toFixed(1);
    } else {
        game.averageRating = -1;
    }
    game.save(err => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Average rating updated to ${game.averageRating}`);
        }
    })
}

module.exports = {
    gamesGetAll,
    gamesGetOne,
    reviewsGetOne,
    gamesAddOne,
    reviewsAddOne,
    doReviewsAddOne,
    reviewUpdateOne,
    reviewDeleteOne,
    updateAverageRating
}