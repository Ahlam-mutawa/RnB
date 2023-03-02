const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    itemImage: { type: String, default: "default.jpg" },
    priceRate: { type: Number, required: true },
    deposit: { type: Number, required: true },
    condition: { type: String, enum: ['new', 'good', 'old'], required: true },
    type: { type: String, enum: ['home appliances', 'electronics', 'other'], required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    borrowDate: { type: Date },
    isAvailable: { type: Boolean, default: true, required: true }
}, { timestamps: true })


itemSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'item'
})
itemSchema.virtual('numOfReview', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'item',
    count: true
})
itemSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Item', itemSchema)