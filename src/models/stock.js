const mongoose = require('mongoose')
const Joi = require('joi')
const JoiOid = require('joi-oid')

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

async function validateStock(stock) {
    const schema = Joi.object({
        productId: JoiOid.objectId().required(),
        locationId: JoiOid.objectId().required(),
        quantity: Joi.number().min(0).required()
    })

    return await schema.validateAsync(stock, { abortEarly: false })
}

module.exports = {
    model: mongoose.model('Stock', stockSchema),
    validate: validateStock
}