const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const minioController = require('../controllers/minio-controller');

const environmentConfigs = process.env

router.post(`${environmentConfigs.createBucketAction}`, minioController.validateHeaders(), minioController.createBucket);
router.post(`${environmentConfigs.uploadFileAction}`, minioController.validateHeaders(), minioController.uploadFile);
router.post(`${environmentConfigs.uploadFilesAction}`, minioController.validateHeaders(), minioController.uploadFiles);
router.get(`${environmentConfigs.downloadFileAction}`, minioController.validateHeaders(), minioController.downloadFile);
router.get(`${environmentConfigs.downloadFilesAction}`, minioController.validateHeaders(), minioController.downloadAllFiles);
router.delete(`${environmentConfigs.deleteFileAction}`, minioController.validateHeaders(), minioController.deleteFile);
router.delete(`${environmentConfigs.deleteAllFilesAction}`, minioController.validateHeaders(), minioController.deleteFiles);

module.exports = router;