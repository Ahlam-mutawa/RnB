const mongoose = require('mongoose')
//Review Schema
const reviewSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    description: { type: String, required: true },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', required: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
}, { timetamps: true }
)

module.exports = mongoose.model('Review', reviewSchema)