const StockModel = require('../models/stock');

const applyStrategy = async function(order) {
    let products = order.products;
    let orderProcessing = [];

    for (const product of products) {
        let stockEntries = await StockModel.find({ "_id.productId": product.productId });
        stockEntries.sort(function(a, b) {
            return b.quantity - a.quantity;
        });

        if (stockEntries.length > 0) {
            for (const stock of stockEntries) {
                if (product.quantity > 0) {
                    // we still must complete the quantity for this product
                    if (stock.quantity >= product.quantity) {
                        // we found at this location the (remaining) needed quantity of this product
                        orderProcessing.push({
                            productId: product.productId,
                            locationId: stock._id.locationId,
                            quantity: product.quantity
                        });
                        product.quantity = 0;
                    } else {
                        // we found at this location a partial quantity of this product
                        orderProcessing.push({
                            productId: product.productId,
                            locationId: stock._id.locationId,
                            quantity: stock.quantity
                        });
                        product.quantity = product.quantity - stock.quantity;
                    }
                }
            }
            if (product.quantity > 0) {
                // we cannot provide the needed quantity
                return null;
            }
        } else {
            // no stock for the requested product
            return null;
        }
    }

    // the ordered products were found
    return orderProcessing;
}

module.exports = applyStrategy;