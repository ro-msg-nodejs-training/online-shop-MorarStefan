const mongoose = require('mongoose')
const Joi = require('joi')
const JoiOid = require('joi-oid')

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

async function validateOrder(order) {
    const schema = Joi.object({
        createdAt: Joi.date().required(),
        customerId: JoiOid.objectId().required(),
        deliveryAddressId: JoiOid.objectId().required(),
        products: Joi.array().items({
            productId: JoiOid.objectId().required(),
            quantity: Joi.number().min(1).required()
        })
    })

    return await schema.validateAsync(order, { abortEarly: false })
}

module.exports = {
    model: mongoose.model('Order', orderSchema),
    validate: validateOrder
}