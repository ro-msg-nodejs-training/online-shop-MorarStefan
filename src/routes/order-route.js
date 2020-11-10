const router = require('express').Router();

const OrderModel = require('../models/order');
const OrderDetailModel = require('../models/order-detail');
const StockModel = require('../models/stock');

const closestLocationStrategy = require('../strategies/closest-location-strategy');
const mostAbundantStrategy = require('../strategies/most-abundant-strategy');

const orderDTO = require('../dtos/order-dto');

router.post('/', async(req, res) => {
    let orderProcessing;
    const products = req.body.products.map(a => ({...a }));
    
    try {
        if (process.env.STRATEGY === 'CLOSEST') {
            orderProcessing = await closestLocationStrategy(req.body);
        } else {
            orderProcessing = await mostAbundantStrategy(req.body);
        }

        if (orderProcessing === null) {
            throw "Could not find all needed products to complete the order.";
        }
        decreaseStock(orderProcessing);

        // set the first location as the "shippedFrom" location
        const createdOrder = await createOrder(req.body, orderProcessing[0].locationId);

        createOrderDetails(createdOrder._id, products);

        const returnedOrderDTO = await orderDTO.modelToDTO(createdOrder);
        res.status(200).json(returnedOrderDTO);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

async function decreaseStock(orderProcessing) {
    for (const orderEntry of orderProcessing) {
        const previousStock = await StockModel.findOne({ "_id.productId": orderEntry.productId, "_id.locationId": orderEntry.locationId });
        const newQuantity = previousStock.quantity - orderEntry.quantity;

        if (newQuantity > 0) {
            // update
            await StockModel.findOneAndUpdate({ "_id.productId": orderEntry.productId, "_id.locationId": orderEntry.locationId }, {
                $set: {
                    quantity: newQuantity
                }
            });
        } else {
            // delete 
            await StockModel.findOneAndDelete({ "_id.productId": orderEntry.productId, "_id.locationId": orderEntry.locationId });
        }
    }
}

async function createOrder(order, locationId) {
    const newOrder = new OrderModel({
        shippedFrom: locationId,
        customerId: order.customerId,
        createdAt: order.createdAt,
        addressId: order.deliveryAddressId
    });

    const savedOrder = await newOrder.save();
    return savedOrder;
}

async function createOrderDetails(orderId, products) {
    for (const product of products) {
        const orderDetail = new OrderDetailModel({
            _id: {
                orderId: orderId,
                productId: product.productId
            },
            quantity: product.quantity
        });

        await orderDetail.save();
    }
}

module.exports = router;