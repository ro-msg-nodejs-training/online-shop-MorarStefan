const mongoose = require('mongoose')

const orderDetailSchema = new mongoose.Schema({
    _id: {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    },
    quantity: {
        type: Number,
        required: true
    }
})

module.exports = {
    model: mongoose.model('OrderDetail', orderDetailSchema)
}