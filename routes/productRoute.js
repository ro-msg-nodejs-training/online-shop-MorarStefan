const router = require('express').Router();

const ProductModel = require('../models/product');

router.get('/', async(req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/:productId', async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (product !== null) {
            res.status(200).json(product);
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.params.productId + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.delete('/:productId', async(req, res) => {
    try {
        const product = await ProductModel.findOneAndDelete({ _id: req.params.productId });
        if (product !== null) {
            res.status(200).json(product);
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.params.productId + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.post('/', async(req, res) => {
    const product = new ProductModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        weight: req.body.weight,
        categoryId: req.body.categoryId,
        supplierId: req.body.supplierId,
        imageUrl: req.body.imageUrl
    });
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.put('/', async(req, res) => {
    try {
        const updatedProduct = await ProductModel.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                weight: req.body.weight,
                categoryId: req.body.categoryId,
                supplierId: req.body.supplierId,
                imageUrl: req.body.imageUrl
            }
        }, { new: true });
        if (updatedProduct !== null) {
            res.status(200).json(updatedProduct);
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.body._id + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;