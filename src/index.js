const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config({ path: __dirname + '/../.env' })

require('./database');

const routes = require('./routes');

app.use('/categories', routes.categoryRoute);
app.use('/products', routes.productRoute);
app.use('/suppliers', routes.supplierRoute);
app.use('/orders', routes.orderRoute);
app.use('/stocks', routes.stockRoute);

app.listen(3000, () =>
    console.log('Listening on port 3000!'),
);