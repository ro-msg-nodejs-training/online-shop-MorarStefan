const router = require('express').Router();

const SupplierModel = require('../models/supplier').model;
const supplierValidation = require('../models/supplier').validate;

router.get('/', async(_req, res) => {
    try {
        const suppliers = await SupplierModel.find();
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.post('/', async(req, res) => {
    try {
        await supplierValidation(req.body);
        const supplier = new SupplierModel({
            name: req.body.name
        });

        const savedSupplier = await supplier.save();
        res.status(201).json(savedSupplier);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;