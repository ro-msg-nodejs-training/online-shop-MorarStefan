let mongoose = require('mongoose')

let supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('Supplier', supplierSchema)