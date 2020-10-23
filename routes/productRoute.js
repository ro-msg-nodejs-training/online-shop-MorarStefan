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
    var products = Object.values(req.context.products);
    var product = findProduct(products, req.params.productId);
    if (product !== null) {
        products.splice(Object.values(req.context.products).indexOf(product), 1);
        return res.status(200).json(product);
    }
    res.status(404).send('Product with ID: ' + req.params.productId + ' not found.');
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