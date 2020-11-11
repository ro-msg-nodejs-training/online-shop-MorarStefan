const router = require('express').Router();

const StockModel = require('../models/stock').model;
const stockValidation = require('../models/stock').validate;

const stockDTO = require('../dtos/stock-dto');

router.post('/', async(req, res) => {
    try {
        await stockValidation(req.body);
        const existingStock = await StockModel.findOne({ "_id.productId": req.body.productId, "_id.locationId": req.body.locationId });

        if (existingStock === null) {
            const stock = new StockModel({
                _id: {
                    productId: req.body.productId,
                    locationId: req.body.locationId
                },
                quantity: req.body.quantity
            });

            const savedStock = await stock.save();
            const returnedStockDTO = await stockDTO.modelToDTO(savedStock);
            res.status(201).json(returnedStockDTO);

        } else {
            res.status(400).json({ message: 'Stock for product: ' + req.body.productId + ' at location: ' + req.body.locationId + ' already exists.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.put('/', async(req, res) => {
    try {
        await stockValidation(req.body);
        const updatedStock = await StockModel.findOneAndUpdate({ "_id.productId": req.body.productId, "_id.locationId": req.body.locationId }, {
            $set: {
                quantity: req.body.quantity
            }
        }, { new: true });
        if (updatedStock !== null) {
            const returnedStockDTO = await stockDTO.modelToDTO(updatedStock);
            res.status(200).json(returnedStockDTO);
        } else {
            res.status(400).json({ message: 'Stock for product: ' + req.body.productId + ' at location: ' + req.body.locationId + ' not found.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;