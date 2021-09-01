const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const farmController = require('../controllers/farm-management-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllFarmDetails}`, farmController.validateHeaders(), farmController.getAllFarmDetails);
router.get(`${environmentConfigs.getFarmDetail}`, farmController.validateHeaders(), farmController.getFarmDetail);
router.post(`${environmentConfigs.createFarmDetail}`, farmController.validateHeaders(), farmController.validate('saveFarmDetail'), farmController.saveFarmDetail);
router.put(`${environmentConfigs.updateFarmDetail}`, farmController.validateHeaders(), farmController.validate('udpateFarmDetail'), farmController.udpateFarmDetail);
router.post(`${environmentConfigs.deleteFarmDetail}`, farmController.validateHeaders(), farmController.deleteFarmDetail);

module.exports = router;