const mongoose = require('mongoose')
const Joi = require('joi')
const JoiOid = require('joi-oid')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    imageUrl: String
})

async function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(0).max(255),
        price: Joi.number().min(0).required(),
        weight: Joi.number().min(0).required(),
        categoryId: JoiOid.objectId().required(),
        supplierId: JoiOid.objectId().required(),
        imageUrl: Joi.string().min(0).max(255)
    })

    return await schema.validateAsync(product, { abortEarly: false })
}

module.exports = {
    model: mongoose.model('Product', productSchema),
    validate: validateProduct
}