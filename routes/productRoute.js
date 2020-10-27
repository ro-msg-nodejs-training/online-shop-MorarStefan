const router = require('express').Router();

router.get('/', (req, res) => {
    return res.status(200).send(Object.values(req.context.products));
});

router.get('/:productId', (req, res) => {
    var product = findProduct(Object.values(req.context.products), req.params.productId);
    if (product !== null) {
        return res.status(200).json(product);
    }
    res.status(404).send('Product with ID: ' + req.params.productId + ' not found.');
});

router.delete('/:productId', (req, res) => {
    var product = findProduct(Object.values(req.context.products), req.params.productId);
    if (product !== null) {
        req.context.products.splice(req.context.products.indexOf(product), 1);
        return res.status(200).json(product);
    }
    res.status(404).send('Product with ID: ' + req.params.productId + ' not found.');
});

router.post('/', (req, res) => {
    const size = Object.values(req.context.products).length;
    var product = {
        id: size + 1,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        weight: req.body.weight,
        categoryId: req.body.categoryId,
        supplier: req.body.supplier,
        imageUrl: req.body.imageUrl
    };
    req.context.products[size + 1] = product;
    res.status(200).json(product);
});

router.put('/', (req, res) => {
    var products = Object.values(req.context.products);
    var product = findProduct(products, req.body.id);
    if (product !== null) {
        req.context.products[req.context.products.indexOf(product)] = req.body;
        return res.status(200).json(req.body);
    }
    res.status(404).send('Product with ID: ' + req.body.id + ' not found.');
});

function findProduct(products, productId) {
    var product = null;
    products.forEach(element => {
        if (element.id === parseInt(productId)) {
            product = element;
        }
    });
    return product;
}

module.exports = router;