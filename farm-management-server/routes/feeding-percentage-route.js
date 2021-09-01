const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const feedingPercentageController = require('../controllers/feeding-percentage-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllFeedingPercentageDetails}`, feedingPercentageController.validateHeaders(), feedingPercentageController.getAllDetails);
router.get(`${environmentConfigs.getFeedingPercentageDetail}`, feedingPercentageController.validateHeaders(), feedingPercentageController.getDetail);
router.post(`${environmentConfigs.createFeedingPercentageCollection}`, feedingPercentageController.validateHeaders(), feedingPercentageController.saveDetails);
router.post(`${environmentConfigs.createFeedingPercentageDetail}`, feedingPercentageController.validateHeaders(), feedingPercentageController.validate('saveDetail'), feedingPercentageController.saveDetail);
router.put(`${environmentConfigs.updateFeedingPercentageDetail}`, feedingPercentageController.validateHeaders(), feedingPercentageController.validate('udpateDetails'), feedingPercentageController.udpateDetails);
router.post(`${environmentConfigs.deleteFeedingPercentageDetail}`, feedingPercentageController.validateHeaders(), feedingPercentageController.deleteDetails);

module.exports = router;