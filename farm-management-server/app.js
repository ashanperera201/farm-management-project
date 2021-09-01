
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const applicationHeaders = require('./helpers/header-middleware');
const authJwtMiddleWare = require('./helpers/auth-token-middleware');
const errorHanlder = require('./helpers/error-handler-middleware');

//#region 
// * ALL ROUTES
const roleRoutes = require('./routes/role-route');
const permissionRoutes = require('./routes/permission-route');
const userRoutes = require('./routes/user-route');
const minioRoutes = require('./routes/minio-route');
const clubMemberRoutes = require('./routes/club-member-route');
const farmManagementRoutes = require('./routes/farm-management-route');
const pondManagementRoutes = require('./routes/pond-management-route');
const applicationRoutes = require('./routes/applications-route');
const stockRoutes = require('./routes/stock-route');
const weeklySamplingRoutes = require('./routes/weekly-sampling');
const weeklyPerformanceRoutes = require('./routes/weekly-performance-route');
const feedingPercentageRoutes = require('./routes/feeding-percentage-route');
const harvestManagementRoutes = require('./routes/harvest-management-route');
const feedBrandRoutes = require('./routes/feed-brand-route');
const dailyFeedRoutes = require('./routes/daily-feed-route');
const weeklyApplicationsRoutes = require('./routes/weekly-application-routes');
const salesRoutes = require('./routes/sales-routing');
const reportingRoutes = require('./routes/reporting-route');
//#endregion

const app = express()
require('dotenv').config({ path: `./env-${process.env.NODE_ENV}.env` })


app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors({ origin: { global: true } }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))
app.use(authJwtMiddleWare());
app.use(applicationHeaders);
app.use(errorHanlder.applicationErrorHandler);

const environmentConfigs = process.env;
//routes
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.permissionContrllerRoute}`, permissionRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.roleControllerRoute}`, roleRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.userControllerRoute}`, userRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.minioControllerRoute}`, minioRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.clubMemberControllerRoute}`, clubMemberRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.farmManagementControllerRoute}`, farmManagementRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.pondManagementControllerRoute}`, pondManagementRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.feedBrandControllerRoute}`, feedBrandRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.applicationControllerRoute}`, applicationRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.stockControllerRoute}`, stockRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.weeklySamplingControllerRoute}`, weeklySamplingRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.feedingPercentageControllerRoute}`, feedingPercentageRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.dailyFeedControllerRoute}`, dailyFeedRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.weeklyApplicationControllerRoute}`, weeklyApplicationsRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.weeklyPerformanceControllerRoute}`, weeklyPerformanceRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.salesPriceControllerRoute}`, salesRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.reportingControllerRoute}`, reportingRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.harvestManagementControllerRoute}`, harvestManagementRoutes);

module.exports = app;