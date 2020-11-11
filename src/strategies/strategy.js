const closestLocationStrategy = require("./closest-location-strategy");
const mostAbundantStrategy = require("./most-abundant-strategy");

const strategy = async function (order) {
  if (process.env.STRATEGY === "CLOSEST") {
    return await closestLocationStrategy(order);
  } else if (process.env.STRATEGY === "ABUNDANT") {
    return await mostAbundantStrategy(order);
  } else {
    // default strategy
    return await closestLocationStrategy(order);
  }
};

module.exports = strategy;
