const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const dailyFeedController = require('../controllers/daily-feed-controller');

const environmentConfigs = process.env;

router.get(`${environmentConfigs.getAllDailyFeedSamplingDetails}`, dailyFeedController.validateHeaders(), dailyFeedController.getAllDetails);
router.get(`${environmentConfigs.getDailyFeedSamplingDetail}`, dailyFeedController.validateHeaders(), dailyFeedController.getDetail);
router.post(`${environmentConfigs.createDailyFeedSamplingCollection}`, dailyFeedController.validateHeaders(), dailyFeedController.saveDetails);
router.post(`${environmentConfigs.createDailyFeedSamplingDetail}`, dailyFeedController.validateHeaders(), dailyFeedController.validate('saveDetail'), dailyFeedController.saveDetail);
router.put(`${environmentConfigs.updateDailyFeedSamplingDetail}`, dailyFeedController.validateHeaders(), dailyFeedController.validate('updateDetail'), dailyFeedController.updateDetail);
router.post(`${environmentConfigs.deleteDailyFeedSamplingDetail}`, dailyFeedController.validateHeaders(), dailyFeedController.deleteDetails);

module.exports = router;