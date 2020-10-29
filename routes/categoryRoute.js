const router = require('express').Router();

const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');

const productDTO = require('../dtos/productDTO');

router.get('/', async(req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/:categoryId/products', async(req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.categoryId);
        if (category !== null) {
            const products = await ProductModel.find({ categoryId: req.params.categoryId });
            const productDTOs = await productDTO.modelsToDTOs(products);
            res.status(200).json(productDTOs);
        } else {
            res.status(400).json({ message: 'Category with ID: ' + req.params.categoryId + ' not found.' });
        }

    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;