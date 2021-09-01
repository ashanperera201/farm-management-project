const { header } = require('express-validator');
const { validationResult } = require('express-validator');
const minioUploadHelper = require('../business/minio/minio-file-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.createBucket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const minioBucketPayload = {
                bucketPath: payload.bucket
            }
            const result = await minioUploadHelper.createBucket(minioBucketPayload);
            if (result && result.validity) {
                res.status(201).json(result)
            } else {
                res.status(500).json(result)
            }
        } else {
            res.status(500).json({ errors: errors.array() })
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.uploadFile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const file = req.files;
            // TODO : ADD THIS IN DMS SIDE.
            // {
            //     "componentUniqueId:"",
            //     "componentName:"",
            //     "componentSavePath:"",
            //     "componentDescription":""
            // }
            const updaloadedResult = await minioUploadHelper.uploadFile(file);
            if (updaloadedResult && updaloadedResult.validity) {
                res.status(201).json(updaloadedResult)
            } else {
                res.status(500).json({ errors: errors.array() });
            }
        } else {
            res.status(500).json({ errors: errors.array() })
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.uploadFiles = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const files = req.files;
            const uploadedResult = await minioUploadHelper.uploadFiles(files);
            if (uploadedResult && uploadedResult.validity) {
                res.status(201).json(uploadedResult)
            } else {
                res.status(500).json({ errors: errors.array() });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.stack, success: false });
    }
}

exports.downloadFile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const fileName = req.params.fileName;
            const downloadResult = await minioUploadHelper.downloadFile(fileName);
            if (downloadResult && downloadResult.validity) {
                downloadResult.stream.pipe(res);
            } else {
                res.status(500).json({ errors: downloadResult.error });
            }
        } else {
            res.status(500).json({ errors: errors.array() })
        }
    } catch (error) {
        res.status(500).json({ error: error.stack, success: false });
    }
}

exports.downloadAllFiles = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const result = await minioUploadHelper.downloadFiles();
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(500);
            }
        } else {
            res.status(500).json({ errors: errors.array() })
        }
    } catch (error) {
        res.status(500).json({ error: error.stack, success: false });
    }
}

exports.deleteFile = async (res, req) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const fileName = req.params.fileName;
            await minioUploadHelper.deleteFile(fileName);
            res.status(200);
        } else {
            res.status(500).json({ errors: errors.array() })
        }
    } catch (error) {
        res.status(500).json({ error: error.stack, success: false });
    }
}

exports.deleteFiles = async (res, req) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            await minioUploadHelper.deleteFiles();
            res.status(200);
        } else {
            res.status(500).json({ errors: errors.array() })
        }
    } catch (error) {
        res.status(500).json({ error: error.stack, success: false });
    }
}