const express = require('express');
const celebrate = require('../../../core/celebrate-wrappers');
const warehouseController = require('./warehouse-controller');
const warehouseValidator = require('./warehouse-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/product', route);

  // get list of product
  // route.get('/', tokoController);

  // create products
  route.post(
    '/',
    celebrate(warehouseValidator.createProducts),
    warehouseController.createProduct
  );

  route.get('/', warehouseController.getProducts);

  route.delete('/:id', warehouseController.deleteProducts);

  route.put(
    '/:id',
    celebrate(warehouseValidator.updateProducts),
    warehouseController.updateProduct
  );
};
