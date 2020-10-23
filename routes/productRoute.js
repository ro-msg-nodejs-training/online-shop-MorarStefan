const router = require('express').Router();

router.get('/:productId', (req, res) => {
    var product = null;
    Object.values(req.context.products).forEach(element => {
        if (element.id === parseInt(req.params.productId)) {
            product = element;
        }
    });
    if (product !== null) {
        return res.status(200).json(product);
    }
    res.status(404).send('Product with ID: ' + req.params.productId + ' not found.');
});

module.exports = router;