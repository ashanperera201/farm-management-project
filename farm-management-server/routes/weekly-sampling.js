const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const weeklySamplingController = require('../controllers/weekly-sampling-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllWeeklySamplingDetails}`, weeklySamplingController.validateHeaders(), weeklySamplingController.getAllDetails);
router.get(`${environmentConfigs.getWeeklySamplingDetail}`, weeklySamplingController.validateHeaders(), weeklySamplingController.getDetail);
router.post(`${environmentConfigs.createWeeklySamplingCollection}`, weeklySamplingController.validateHeaders(), weeklySamplingController.saveDetails);
router.post(`${environmentConfigs.createWeeklySamplingDetail}`, weeklySamplingController.validateHeaders(), weeklySamplingController.validate('saveDetail'), weeklySamplingController.saveDetail);
router.put(`${environmentConfigs.updateWeeklySamplingDetail}`, weeklySamplingController.validateHeaders(), weeklySamplingController.validate('udpateWeeklySample'), weeklySamplingController.udpateWeeklySample);
router.post(`${environmentConfigs.deleteWeeklySamplingDetail}`, weeklySamplingController.validateHeaders(), weeklySamplingController.deleteDetails);

module.exports = router;