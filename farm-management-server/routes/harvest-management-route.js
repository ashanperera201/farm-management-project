const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const harvestManagementController = require('../controllers/harvest-management-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllHarvestDetails}`, harvestManagementController.validateHeaders(), harvestManagementController.getAllDetails);
router.get(`${environmentConfigs.getHarvestDetail}`, harvestManagementController.validateHeaders(), harvestManagementController.getDetail);
router.post(`${environmentConfigs.creatHarvestDetailCollection}`, harvestManagementController.validateHeaders(), harvestManagementController.saveDetails);
router.post(`${environmentConfigs.createHarvestDetail}`, harvestManagementController.validateHeaders(), harvestManagementController.validate('saveDetail'), harvestManagementController.saveDetail);
router.put(`${environmentConfigs.updateHarvestDetail}`, harvestManagementController.validateHeaders(), harvestManagementController.validate('updateDetail'), harvestManagementController.updateDetail);
router.post(`${environmentConfigs.deleteHarvestDetails}`, harvestManagementController.validateHeaders(), harvestManagementController.deleteDetails);

module.exports = router;