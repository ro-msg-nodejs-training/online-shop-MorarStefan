const mongoose = require("mongoose");
const Joi = require("joi");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

async function validateSupplier(supplier) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
  });

  return await schema.validateAsync(supplier, { abortEarly: false });
}

module.exports = {
  model: mongoose.model("Supplier", supplierSchema),
  validate: validateSupplier,
};
