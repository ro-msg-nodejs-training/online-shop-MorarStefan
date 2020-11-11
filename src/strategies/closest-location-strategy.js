const axios = require("axios");

const LocationModel = require("../models/location").model;
const AddressModel = require("../models/address").model;
const StockModel = require("../models/stock").model;

const applyStrategy = async function (order) {
  const locationsByDistance = await getLocationsOrderedByDistance(
    order.deliveryAddressId
  );

  const [products, orderProcessing] = await processOrder(
    locationsByDistance,
    order.products
  );

  for (const product of products) {
    if (product.quantity !== 0) {
      // the ordered products were not found
      return null;
    }
  }

  // the ordered products were found
  return orderProcessing;
};

async function getLocationsOrderedByDistance(deliveryAddressId) {
  const addresses = [];
  const deliveryAddress = await AddressModel.findById(deliveryAddressId);
  addresses.push(deliveryAddress.fullAddress);

  const locations = await LocationModel.find();
  for (const location of locations) {
    const address = await AddressModel.findById(location.addressId);
    addresses.push(address.fullAddress);
  }

  const mapQuestResult = await axios.post(
    "http://www.mapquestapi.com/directions/v2/routematrix?key=" +
      process.env.API_KEY,
    {
      locations: addresses,
    }
  );
  mapQuestResult.data.distance.shift();

  let index = 0;
  const locationsByDistance = [];
  for (const location of locations) {
    locationsByDistance.push({
      locationId: location._id,
      distance: mapQuestResult.data.distance[index],
    });
    index++;
  }

  locationsByDistance.sort(function (a, b) {
    return a.distance - b.distance;
  });

  return locationsByDistance;
}

async function processOrder(locationsByDistance, products) {
  const orderProcessing = [];

  for (const location of locationsByDistance) {
    for (const product of products) {
      if (product.quantity > 0) {
        // we still must complete the quantity for this product
        const stock = await StockModel.findOne({
          "_id.productId": product.productId,
          "_id.locationId": location.locationId,
        });
        if (stock !== null) {
          if (stock.quantity >= product.quantity) {
            // we found at this location the (remaining) needed quantity of this product
            orderProcessing.push({
              productId: product.productId,
              locationId: location.locationId,
              quantity: product.quantity,
            });
            product.quantity = 0;
          } else {
            // we found at this location a partial quantity of this product
            orderProcessing.push({
              productId: product.productId,
              locationId: location.locationId,
              quantity: stock.quantity,
            });
            product.quantity = product.quantity - stock.quantity;
          }
        }
      }
    }
  }

  return [products, orderProcessing];
}

module.exports = applyStrategy;
