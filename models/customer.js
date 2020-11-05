let mongoose = require('mongoose')

let customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    }
})

customerSchema.virtual('fullName').get(function() {
    return this.firstName + " " + this.lastName
})

module.exports = mongoose.model('Customer', customerSchema)