const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');

const model = require('./data/memory');

app.use(async(req, res, next) => {
    const categories = await model.categories;
    const products = await model.products;
    req.context = {
        products,
        categories,
    };
    next();
});

app.use('/categories', routes.categoryRoute);
app.use('/products', routes.productRoute);

app.listen(3000, () =>
    console.log('App listening on port 3000!'),
);