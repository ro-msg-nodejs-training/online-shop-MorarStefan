const CategoryModel = require('../models/category').model;
const SupplierModel = require('../models/supplier').model;

const modelToDTO = async function(product) {
    const category = await CategoryModel.findById(product.categoryId);
    const supplier = await SupplierModel.findById(product.supplierId);
    return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        weight: product.weight,
        categoryName: category.name,
        supplierName: supplier.name,
        imageUrl: product.imageUrl
    }
}

const modelsToDTOs = async function(products) {
    const productDTOs = [];
    for (const product of products) {
        const productDTO = await modelToDTO(product);
        productDTOs.push(productDTO);
    }
    return productDTOs;
}

module.exports = {
    modelToDTO,
    modelsToDTOs
}