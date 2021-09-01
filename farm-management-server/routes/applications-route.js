const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const applicationsController = require('../controllers/application-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllApplicationsDetails}`, applicationsController.validateHeaders(), applicationsController.getAplicationDetails);
router.get(`${environmentConfigs.getApplicationsDetail}`, applicationsController.validateHeaders(), applicationsController.getApplication);
router.post(`${environmentConfigs.createApplicationsDetail}`, applicationsController.validateHeaders(), applicationsController.validate('saveApplication'), applicationsController.saveApplication);
router.put(`${environmentConfigs.updateApplicationsDetail}`, applicationsController.validateHeaders(), applicationsController.validate('updateApplication'), applicationsController.updateApplication);
router.post(`${environmentConfigs.deleteApplicationsDetail}`, applicationsController.validateHeaders(), applicationsController.deleteApplications);

module.exports = router;