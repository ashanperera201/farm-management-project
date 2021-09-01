const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const weeklyPerformanceController = require('../controllers/weekly-performance-controller');

const environmentConfigs = process.env;

router.get(`${environmentConfigs.deleteWeeklyPerformanceDetail}`, weeklyPerformanceController.validateHeaders(), weeklyPerformanceController.getAllDetails);
router.get(`${environmentConfigs.getWeeklyPerformanceDetail}`, weeklyPerformanceController.validateHeaders(), weeklyPerformanceController.getDetail);
router.post(`${environmentConfigs.createWeeklyPerformanceCollection}`, weeklyPerformanceController.validateHeaders(), weeklyPerformanceController.saveDetails);
router.post(`${environmentConfigs.createWeeklyPerformanceDetail}`, weeklyPerformanceController.validateHeaders(), weeklyPerformanceController.validate('saveDetail'), weeklyPerformanceController.saveDetail);
router.put(`${environmentConfigs.updateWeeklyPerformanceDetail}`, weeklyPerformanceController.validateHeaders(), weeklyPerformanceController.validate('updateDetail'), weeklyPerformanceController.updateDetail);
router.post(`${environmentConfigs.deleteWeeklyPerformanceDetail}`, weeklyPerformanceController.validateHeaders(), weeklyPerformanceController.deleteDetails);

module.exports = router;