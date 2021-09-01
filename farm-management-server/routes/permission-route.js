const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const permissionController = require('../controllers/permission-controller')

const environmentConfigs = process.env

router.get(`${environmentConfigs.permissionDetailsAction}`, permissionController.validateHeaders(), permissionController.getPermissionDetails)
router.get(`${environmentConfigs.permissionDetailAction}`, permissionController.validateHeaders(), permissionController.getPermissionDetail)
router.post(`${environmentConfigs.permissionCreateAction}`, permissionController.validateHeaders(), permissionController.validate('savePermission'), permissionController.savePermission)
router.post(`${environmentConfigs.permissionCollectionAction}`, permissionController.validateHeaders(), permissionController.savePermissionCollection)
router.post(`${environmentConfigs.permissionFilterAction}`, permissionController.validateHeaders(), permissionController.getFilteredPermission)
router.put(`${environmentConfigs.permissionUpdateAction}`, permissionController.validateHeaders(), permissionController.validate('updatePermission'), permissionController.updatePermission)
router.post(`${environmentConfigs.permissionDeleteAction}`, permissionController.validateHeaders(), permissionController.deletePermission)


module.exports = router;