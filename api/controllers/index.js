const indexInfo = function (req, res) {
    res.json({
        routes: {
            games: {
                getAll: '/games',
                getOneAndReviews: '/:gameId',
                add: {
                    route: '/games',
                    method: 'post',
                    requireAuth: true,
                    parameters: { name: "String", company: "String / not required" }
                },
            },
            reviews: {
                getOne: '/games/:gameId/reviews/:reviewId',
                create: {
                    route: '/:gameId/reviews/',
                    method: 'post',
                    requireAuth: true,
                    parameters: { comment: "String", rating: "Number" }
                },
                updateOne: {
                    route: '/:gameId/reviews/:reviewId',
                    method: 'put',
                    requireAuth: true,
                    parameters: { comment: "String", rating: "Number" }

                }, deleteOne: {
                    route: '/:gameId/reviews/:reviewId',
                    method: 'delete',
                    requireAuth: true,
                }
            },
            users: {
                login: {
                    route: '/users/login',
                    method: 'post',
                    requireAuth: true,
                    parameters: { name: "String", password: "String" }
                },
                register: {
                    route: '/users/register',
                    parameters: { name: "String", password: "String" }
                }
            }
        }
    });
}



module.exports = {
    indexInfo
}