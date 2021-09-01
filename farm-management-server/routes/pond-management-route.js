const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const pondController = require('../controllers/pond-management-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllPondDetails}`, pondController.validateHeaders(), pondController.getAllPondDetails);
router.get(`${environmentConfigs.getPondDetail}`, pondController.validateHeaders(), pondController.getPondDetail);
router.post(`${environmentConfigs.createPondDetail}`, pondController.validateHeaders(), pondController.validate('savePondDetail'), pondController.savePondDetail);
router.put(`${environmentConfigs.updatePondDetail}`, pondController.validateHeaders(), pondController.validate('updatePondDetail'), pondController.updatePondDetail);
router.post(`${environmentConfigs.deletePondDetail}`, pondController.validateHeaders(), pondController.deletePondDetail);

module.exports = router;