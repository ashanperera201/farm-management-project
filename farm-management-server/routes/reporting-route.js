const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const reportController = require('../controllers/reporting-controller');

const environmentConfigs = process.env

router.post(`${environmentConfigs.clubMemberDetails}`, reportController.validateHeaders(), reportController.getClubMemberReport);
router.post(`${environmentConfigs.farmDetail}`, reportController.validateHeaders(), reportController.getFarmDetailReport);
router.post(`${environmentConfigs.pondDetail}`, reportController.validateHeaders(), reportController.getPondDetailReport);
router.post(`${environmentConfigs.pondBrandDetail}`, reportController.validateHeaders(), reportController.getFeedBrandDetailReport);
router.post(`${environmentConfigs.applicationDetail}`, reportController.validateHeaders(), reportController.getApplicationReport);
router.post(`${environmentConfigs.percentageOfFeedingDetail}`, reportController.validateHeaders(), reportController.getFeedingPercentageReport);
router.post(`${environmentConfigs.salesPriceDetails}`, reportController.validateHeaders(), reportController.getSalesReport);
router.post(`${environmentConfigs.weeklySample}`, reportController.validateHeaders(), reportController.getWeeklySampleReport);
router.post(`${environmentConfigs.weeklyApplication}`, reportController.validateHeaders(), reportController.getWeeklyApplicationReport);
router.post(`${environmentConfigs.harvestDetails}`, reportController.validateHeaders(), reportController.getHavestReportingDetails);

module.exports = router;