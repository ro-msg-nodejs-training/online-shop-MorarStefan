let mongoose = require('mongoose')

let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String
})

module.exports = mongoose.model('Category', categorySchema)