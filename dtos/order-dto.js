const LocationModel = require('../models/location');
const CustomerModel = require('../models/customer');
const AddressModel = require('../models/address');

const modelToDTO = async function(order) {
    const shippedFrom = await LocationModel.findById(order.shippedFrom);
    const customer = await CustomerModel.findById(order.customerId);
    const address = await AddressModel.findById(order.addressId);
    return {
        _id: order._id,
        shippedFrom: shippedFrom.name,
        customer: customer.fullName,
        createdAt: order.createdAt,
        address: address.fullAddress
    }
}

module.exports = {
    modelToDTO
}