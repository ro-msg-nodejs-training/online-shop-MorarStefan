const router = require('express').Router();

const ProductModel = require('../models/product');

const productDTO = require('../dtos/productDTO');

const fs = require('fs');
const upload = require('../imageUploader');

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
            try {
                await fs.promises.unlink(product.imageUrl);
            } catch (err) {
                // The old URL does not point to a image in the file system.
            }

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

router.post('/:productId/images', upload.single('productImage'), async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (product !== null) {
            const updatedProduct = await ProductModel.findOneAndUpdate({ _id: product._id }, { $set: { imageUrl: req.file.path } }, { new: true });

            try {
                await fs.promises.unlink(product.imageUrl);
            } catch (err) {
                // The old URL does not point to a image in the file system.
            }

            const returnedProductDTO = await productDTO.modelToDTO(updatedProduct);
            res.status(200).json(returnedProductDTO);
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.body._id + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.delete('/:productId/images', async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (product !== null) {
            const updatedProduct = await ProductModel.findOneAndUpdate({ _id: product._id }, { $set: { imageUrl: "" } }, { new: true });

            try {
                await fs.promises.unlink(product.imageUrl);
            } catch (err) {
                // The old URL does not point to a image in the file system.
            }

            const returnedProductDTO = await productDTO.modelToDTO(updatedProduct);
            res.status(200).json(returnedProductDTO);
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.body._id + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/:productId/images', async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (product !== null) {
            try {
                const stat = await fs.promises.lstat(product.imageUrl);
                if (stat.isFile()) {
                    const readableStream = fs.createReadStream(product.imageUrl);
                    readableStream.on('open', function() {
                        readableStream.pipe(res);
                    });
                    readableStream.on('error', function(err) {
                        res.end(err);
                    });
                } else {
                    res.status(400).json({ message: 'URL: ' + product.imageUrl + ' is not a file.' });
                }
            } catch (err) {
                res.status(400).json({ message: 'File with URL: ' + product.imageUrl + ' not found.' });
            }
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.body._id + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/images/*', async(req, res) => {
    try {
        const imageUrls = [];
        const products = await ProductModel.find();
        for (const product of products) {
            imageUrls.push({
                imageUrl: product.imageUrl
            });
        }
        res.status(200).json(imageUrls);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;