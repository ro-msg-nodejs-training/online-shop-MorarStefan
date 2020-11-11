const ProductModel = require('../models/product').model;
const LocationModel = require('../models/location').model;

const modelToDTO = async function(stock) {
    const product = await ProductModel.findById(stock._id.productId);
    const location = await LocationModel.findById(stock._id.locationId);
    return {
        _id: {
            productId: product._id,
            locationId: location._id
        },
        productName: product.name,
        locationName: location.name,
        quantity: stock.quantity
    }
}

module.exports = {
    modelToDTO
}