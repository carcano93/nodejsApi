const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    comment: { type: String, required: true, minlength: 10 },
    date: { type: Date, required: true, default: Date.now },
    rating: {
        type: Number, enum: {
            values: [0, 1, 2, 3, 4, 5],
            message: '{VALUE} is not supported, correct values: 0, 1, 2, 3, 4 or 5'
        }
    },
});

const gamesSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    company: { type: String, default: "" },
    name:{ type: String, required: true },
    reviews: [reviewsSchema],
    averageRating: { type: Number, default: -1, min: -1, max: 5 },  //-1 means the game does not have reviews
});


mongoose.model('Games', gamesSchema, 'Games');


