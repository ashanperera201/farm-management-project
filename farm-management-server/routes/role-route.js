const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const roleController = require('../controllers/role-controller')

const environmentConfigs = process.env

router.post(`${environmentConfigs.rolesCreationAction}`, roleController.validateHeaders(), roleController.saveRoles)
router.get(`${environmentConfigs.roleDetailsAction}`, roleController.validateHeaders(), roleController.geRoleDetails)
router.get(`${environmentConfigs.roleDetailAction}`, roleController.validateHeaders(), roleController.getRoleDetail)
router.post(`${environmentConfigs.roleCreateAction}`, roleController.validateHeaders(), roleController.validate('saveRole'), roleController.saveRole)
router.post(`${environmentConfigs.roleFilterationAction}`, roleController.validateHeaders(), roleController.getFilteredRole)
router.put(`${environmentConfigs.roleUpdateAction}`, roleController.validateHeaders(), roleController.validate('updateRole'), roleController.updateRole)
router.post(`${environmentConfigs.roleDeleteAction}`, roleController.validateHeaders(), roleController.deleteRoles)

module.exports = router;