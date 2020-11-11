const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  county: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
});

addressSchema.virtual("fullAddress").get(function () {
  return (
    this.city +
    ", " +
    this.county +
    ", " +
    this.country +
    ", " +
    this.streetAddress
  );
});

module.exports = {
  model: mongoose.model("Address", addressSchema),
};
