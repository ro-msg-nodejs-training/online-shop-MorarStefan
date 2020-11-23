const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require("dotenv").config({ path: __dirname + "/../.env" });

require("./database");

const routes = require("./routes");

app.use("/categories", routes.categoryRoute);
app.use("/products", routes.productRoute);
app.use("/suppliers", routes.supplierRoute);
app.use("/orders", routes.orderRoute);
app.use("/stocks", routes.stockRoute);

app.listen(4000, () => console.log("Listening on port 4000!"));
