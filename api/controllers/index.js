const indexInfo = function (req, res) {
    res.json({
        routes: {
            games: {
                getAll: '/games',
                getOne: '/:gameId',
                add: {
                    route: '/games',
                    method: 'post',
                    requireAuth: true,
                },
                reviews: {
                    getAll: '/:gameId/reviews/',
                    getOne: '/games/:gameId/reviews/:reviewId',
                    add: {
                        route: '/:gameId/reviews/',
                        method: 'post',
                        require: [''],
                        requireAuth: true,
                    },
                    deleteOne: {
                        route: '/:gameId/reviews/:reviewId',
                        method: 'delete',
                        requireAuth: true,
                    },
                    updateOne: {
                        route: '/:gameId/reviews/:reviewId',
                        method: 'put',
                        requireAuth: true,
                    }
                }
            },

            users: {
                login: '/login',
                register: {
                    route: '/register',
                    requireAuth: true,
                }
            }
        }
    });
}



module.exports = {
    indexInfo
}