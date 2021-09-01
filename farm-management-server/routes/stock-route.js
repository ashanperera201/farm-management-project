const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const stockController = require('../controllers/stocking-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllStocksDetails}`, stockController.validateHeaders(), stockController.getAllStockDetails);
router.get(`${environmentConfigs.getStocksDetail}`, stockController.validateHeaders(), stockController.getStockDetail);
router.post(`${environmentConfigs.createStockCollection}`, stockController.validateHeaders(), stockController.saveStockDetails);
router.post(`${environmentConfigs.createStocksDetail}`, stockController.validateHeaders(), stockController.validate('saveStockDetail'), stockController.saveStockDetail);
router.put(`${environmentConfigs.updateStocksDetail}`, stockController.validateHeaders(), stockController.validate('updateStockDetail'), stockController.updateStockDetail);
router.post(`${environmentConfigs.deleteStocksDetail}`, stockController.validateHeaders(), stockController.deleteStockDetail);

module.exports = router;