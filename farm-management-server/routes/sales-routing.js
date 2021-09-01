const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const salesController = require('../controllers/sales-controller');

const environmentConfigs = process.env;

router.get(`${environmentConfigs.getAllSalesDetails}`, salesController.validateHeaders(), salesController.getAllDetails);
router.get(`${environmentConfigs.getSalesDetail}`, salesController.validateHeaders(), salesController.getDetail);
router.post(`${environmentConfigs.createSalesCollection}`, salesController.validateHeaders(), salesController.saveDetails);
router.post(`${environmentConfigs.createSalesDetail}`, salesController.validateHeaders(), salesController.validate('saveDetail'), salesController.saveDetail);
router.put(`${environmentConfigs.updateSalesDetail}`, salesController.validateHeaders(), salesController.validate('updateDetail'), salesController.updateDetail);
router.post(`${environmentConfigs.deleteSalesDetail}`, salesController.validateHeaders(), salesController.deleteDetails);

module.exports = router;