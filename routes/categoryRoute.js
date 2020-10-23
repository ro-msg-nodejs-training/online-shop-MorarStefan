const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send(Object.values(req.context.categories));
});

router.get('/:categoryId/products', (req, res) => {
    var category = null;
    Object.values(req.context.categories).forEach(element => {
        if (element.id === parseInt(req.params.categoryId)) {
            category = element;
        }
    });
    if (category !== null) {
        var productsInCategory = []
        Object.values(req.context.products).forEach(element => {
            if (element.categoryId === parseInt(req.params.categoryId)) {
                productsInCategory.push(element);
            }
        });
        return res.send(productsInCategory);
    }
    res.status(404).send('Category with ID: ' + req.params.categoryId + ' not found.');
});

module.exports = router;