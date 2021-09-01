const express = require("express");
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const router = express.Router();
const userController = require("../controllers/user-controller");

const environmentConfigs = process.env;

router.put(`${environmentConfigs.changePasswordAction}`, userController.validateHeaders(), userController.validate('changePassword'), userController.changePassword)
router.get(`${environmentConfigs.userDetailsAction}`, userController.validateHeaders(), userController.getUserDetails)
router.get(`${environmentConfigs.userRolePermissionAction}`, userController.validateHeaders(), userController.getUserRolePermission)
router.get(`${environmentConfigs.userDetailAction}`, userController.validateHeaders(), userController.getUserDetail)
router.post(`${environmentConfigs.userSignUpAction}`, userController.validate('saveUser'), userController.saveUser)
router.post(`${environmentConfigs.userSignInAction}`, userController.validate('UserAuthentication'), userController.UserAuthentication)
router.post(`${environmentConfigs.userFilterationAction}`, userController.validateHeaders(), userController.getFilteredUser)
router.put(`${environmentConfigs.userUpdateAction}`, userController.validateHeaders(), userController.validate('updateUser'), userController.updateUser)
router.post(`${environmentConfigs.userDeleteAction}`, userController.validateHeaders(), userController.deleteUsers)

module.exports = router;
