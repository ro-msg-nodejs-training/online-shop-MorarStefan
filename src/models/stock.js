const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    _id: {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        locationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: true
        }
    },
    quantity: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Stock', stockSchema)