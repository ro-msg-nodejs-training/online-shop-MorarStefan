const mongoose = require('mongoose')
const Joi = require('joi')

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
    category: {
        name: {
            type: String,
            required: true
        },
        description: String
    },
    supplier: {
        name: {
            type: String,
            required: true
        }
    },
    imageUrl: String
})

async function validateProduct(product) {
    const supplierSchema = Joi.object({
        name: Joi.string().min(2).max(30).required()
    })

    const categorySchema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        description: Joi.string().min(0).max(255)
    })

    const productSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(0).max(255),
        price: Joi.number().min(0).required(),
        weight: Joi.number().min(0).required(),
        category: categorySchema,
        supplier: supplierSchema,
        imageUrl: Joi.string().min(0).max(255)
    })

    return await productSchema.validateAsync(product, { abortEarly: false })
}

module.exports = {
    model: mongoose.model('Product', productSchema),
    validate: validateProduct
}