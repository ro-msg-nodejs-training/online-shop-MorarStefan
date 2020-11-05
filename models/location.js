let mongoose = require('mongoose')

let locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }
})

module.exports = mongoose.model('Location', locationSchema)