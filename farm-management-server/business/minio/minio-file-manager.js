const Minio = require('minio');
const concat = require('concat-stream')
const { Base64Encode } = require('base64-stream')
require('dotenv').config({ path: `./env-${process.env.NODE_ENV}.env` });
const environmentConfigs = process.env;

const minioClient = new Minio.Client({
    endPoint: environmentConfigs.minioUrl,
    port: +environmentConfigs.minioPort,
    useSSL: Boolean(environmentConfigs.useSsl),
    accessKey: environmentConfigs.accessKey,
    secretKey: environmentConfigs.secretKey
});

exports.createBucket = async (bucketPayload) => {
    let response = { validity: false, result: false, error: '' };
    return new Promise((resolve, reject) => {
        try {
            minioClient.makeBucket(bucketPayload.bucketPath, 'us-east-1', (error) => {
                if (error) {
                    response.error = error.message;
                    reject(response);
                } else {
                    console.log('Successfully bucket created.');
                    response.error = '';
                    response.validity = true;
                    response.result = true;
                    resolve(response);
                }
            })
        } catch (error) {
            response.error = error;
            reject(response);
        }
    });
}

exports.uploadFile = (filePayload) => {
    let response = { validity: false, result: {}, error: '' };
    const fileInfo = filePayload.file;
    return new Promise((resolve, reject) => {
        try {
            // TODO : LATER WE SHOULD TAKE BUCKET INFO AND FILE PATH DYNAMICALLY. 
            // TODO : ADD DMS FEATURE LATER.
            minioClient.putObject('e-commerce', `/products/${fileInfo.name}`, fileInfo.data, fileInfo.size, function (error, objInfo) {
                if (error) {
                    response.error = error;
                    reject(response)
                } else {
                    response.error = '';
                    response.validity = true;
                    const data = { created: true, fileHash: objInfo }
                    response.result = data;
                    resolve(response);
                }
            })
        } catch (error) {
            response.error = error.stack;
            reject(response)
        }
    });
}

exports.uploadFiles = async (uploadedFiles) => {
    let response = { validity: false, result: {}, error: '' };
    const filesSet = uploadedFiles.files;
    let fileHachKeys = [];
    try {

        for (let i = 0; i < filesSet.length; i++) {
            const filePayload = {
                file: filesSet[i]
            }
            const savedFile = await this.uploadFile(filePayload);
            if (savedFile && savedFile.validity) {
                fileHachKeys.push(savedFile.result.fileHash);
            }
        }

        if (fileHachKeys && uploadedFiles.files && fileHachKeys.length === uploadedFiles.files.length) {
            response.error = '';
            response.validity = true;
            const data = { created: true, fileHashKeys: fileHachKeys }
            response.result = data;

        } else {
            // TODO: ADD ROLE BACK MECHANISM
            response.error = 'Failed to create files';
        }
    } catch (error) {
        response.error = error.stack;
    }
    return response;
}

exports.downloadFile = (fileName) => {
    const returnResult = { error: '', validity: false, stream: null };
    return new Promise((resolve, reject) => {
        try {
            minioClient.getObject('e-commerce', `/products/${fileName}`, (error, stream) => {
                if (error) {
                    returnResult.error = 'Failed to load file';
                    reject(returnResult);
                } else {
                    returnResult.validity = true;
                    returnResult.stream = stream;
                    resolve(returnResult);
                }
            });
        } catch (error) {
            returnResult.error = 'Failed to load file';
            reject(error.stack);
        }
    });
}

exports.downloadFiles = async () => {
    let productList = [];
    let imageStreams = []
    const stream = minioClient.listObjects('e-commerce', '/products/', true);
    return new Promise((resolve, reject) => {
        try {
            stream.on('data', async (product) => {
                productList.push(product);
            })
            stream.on('end', async () => {
                for (let i = 0; i < productList.length; i++) {
                    const product = productList[i];
                    const names = product.name.split("/");
                    const downloadResults = await this.downloadFile(names[1]);
                    const base64 = await this.streamToBase64(downloadResults.stream);
                    imageStreams.push({ imgInBase64: base64, imageHash: product.etag, type: names[1] })
                }
                resolve(imageStreams);
            })
            stream.on('error', function (err) { console.log(err) })
        } catch (error) {
            reject(error);
        }
    })
}

exports.streamToBase64 = (stream) => {
    return new Promise((resolve, reject) => {
        const base64 = new Base64Encode()
        const cbConcat = (base64) => {
            resolve(base64)
        }
        stream
            .pipe(base64)
            .pipe(concat(cbConcat))
            .on('error', (error) => {
                reject(error)
            });
    });
}

exports.deleteFile = async (fileName) => {
    await minioClient.removeObject('e-commerce', `/products/${fileName}`);
}

exports.deleteFiles = async (fileNames) => { 
    await minioClient.removeObjects('e-commerce', `/products/`);
}