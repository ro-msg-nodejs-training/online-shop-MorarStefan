const router = require('express').Router();

const ProductModel = require('../models/product');

const productDTO = require('../dtos/productDTO');

router.get('/', async(req, res) => {
    try {
        const products = await ProductModel.find();
        const productDTOs = await productDTO.modelsToDTOs(products);
        res.status(200).json(productDTOs);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/:productId', async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (product !== null) {
            const returnedProductDTO = await productDTO.modelToDTO(product);
            res.status(200).json(returnedProductDTO);
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
            const returnedProductDTO = await productDTO.modelToDTO(product);
            res.status(200).json(returnedProductDTO);
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
        const returnedProductDTO = await productDTO.modelToDTO(savedProduct);
        res.status(201).json(returnedProductDTO);
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
            const returnedProductDTO = await productDTO.modelToDTO(updatedProduct);
            res.status(200).json(returnedProductDTO);
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.body._id + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;