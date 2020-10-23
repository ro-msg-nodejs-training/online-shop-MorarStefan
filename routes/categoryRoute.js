const router = require('express').Router();

router.get('/', (req, res) => {
    return res.status(200).send(Object.values(req.context.categories));
});

router.get('/:categoryId/products', (req, res) => {
    var category = findCategory(Object.values(req.context.categories), req.params.categoryId);
    if (category !== null) {
        var productsInCategory = []
        Object.values(req.context.products).forEach(element => {
            if (element.categoryId === parseInt(req.params.categoryId)) {
                productsInCategory.push(element);
            }
        });
        return res.status(200).send(productsInCategory);
    }
    res.status(404).send('Category with ID: ' + req.params.categoryId + ' not found.');
});

function findCategory(categories, categoryId) {
    var category = null;
    categories.forEach(element => {
        if (element.id === parseInt(categoryId)) {
            category = element;
        }
    });
    return category;
}

module.exports = router;