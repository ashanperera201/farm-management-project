const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const feedBrandController = require('../controllers/feed-brand-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllFeedBrandDetails}`, feedBrandController.validateHeaders(), feedBrandController.getAllFeedBrandDetails);
router.get(`${environmentConfigs.getFeedBrandDetail}`, feedBrandController.validateHeaders(), feedBrandController.getFeedBrandDetail);
router.post(`${environmentConfigs.createFeedBrandDetail}`, feedBrandController.validateHeaders(), feedBrandController.validate('saveFeedBrandDetail'), feedBrandController.saveFeedBrandDetail);
router.put(`${environmentConfigs.updateFeedBrandDetail}`, feedBrandController.validateHeaders(), feedBrandController.validate('updateFeedBrandDetail'), feedBrandController.updateFeedBrandDetail);
router.post(`${environmentConfigs.deleteFeedBrandDetail}`, feedBrandController.validateHeaders(), feedBrandController.deleteFeedBrand);

module.exports = router;