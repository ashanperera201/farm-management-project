
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const expressJwt = require("express-jwt");

const authJwtMiddleWare = () => {
  const environmentConfigs = process.env;
  return expressJwt({
    secret: environmentConfigs.applicationSecret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      `${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.userControllerRoute}${environmentConfigs.userSignInAction}`,
      `${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.userControllerRoute}${environmentConfigs.changePassword}`,
      `${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.userControllerRoute}${environmentConfigs.userSignUpAction}`,
      `${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.permissionContrllerRoute}${environmentConfigs.permissionCollectionAction}`,
      `${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.roleControllerRoute}${environmentConfigs.rolesCreationAction}`,
    ],
  });
};

module.exports = authJwtMiddleWare;
