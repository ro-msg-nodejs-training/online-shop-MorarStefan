const router = require('express').Router();

const ProductModel = require('../models/product').model;
const productValidation = require('../models/product').validate;

const fs = require('fs');
const upload = require('../image-uploader');

router.get('/', async(_req, res) => {
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
            try {
                await fs.promises.unlink(product.imageUrl);
            } catch (err) {
                // The old URL does not point to a image in the file system.
            }

            res.status(200).json(product);
        } else {
            res.status(400).json({ message: 'Product with ID: ' + req.params.productId + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.post('/', async(req, res) => {
    try {
        await productValidation(req.body);
        const product = new ProductModel(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.put('/', async(req, res) => {
    try {
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            weight: req.body.weight,
            category: req.body.category,
            supplier: req.body.supplier,
            imageUrl: req.body.imageUrl
        };
        await productValidation(productData);
        const updatedProduct = await ProductModel.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                weight: req.body.weight,
                category: req.body.category,
                supplier: req.body.supplier,
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

            res.status(200).json(updatedProduct);
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

            res.status(200).json(updatedProduct);
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

router.get('/images/*', async(_req, res) => {
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