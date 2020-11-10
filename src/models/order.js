const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    shippedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    createdAt: Date,
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema)