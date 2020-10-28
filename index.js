const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./database');

const routes = require('./routes');

app.use('/categories', routes.categoryRoute);
app.use('/products', routes.productRoute);
app.use('/suppliers', routes.supplierRoute);

app.listen(3000, () =>
    console.log('Listening on port 3000!'),
);