const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const weeklyApplicationController = require('../controllers/weekly-application-controller');

const environmentConfigs = process.env;

router.get(`${environmentConfigs.getAllWeeklyApplicationDetails}`, weeklyApplicationController.validateHeaders(), weeklyApplicationController.getAllDetails);
router.get(`${environmentConfigs.getWeeklyApplicationDetail}`, weeklyApplicationController.validateHeaders(), weeklyApplicationController.getDetail);
router.post(`${environmentConfigs.createWeeklyApplicationCollection}`, weeklyApplicationController.validateHeaders(), weeklyApplicationController.saveDetails);
router.post(`${environmentConfigs.createWeeklyApplicationDetail}`, weeklyApplicationController.validateHeaders(), weeklyApplicationController.validate('saveDetail'), weeklyApplicationController.saveDetail);
router.put(`${environmentConfigs.updateWeeklyApplicationDetail}`, weeklyApplicationController.validateHeaders(), weeklyApplicationController.validate('updateDetail'), weeklyApplicationController.updateDetail);
router.post(`${environmentConfigs.deleteWeeklyApplicationDetail}`, weeklyApplicationController.validateHeaders(), weeklyApplicationController.deleteDetails);

module.exports = router;