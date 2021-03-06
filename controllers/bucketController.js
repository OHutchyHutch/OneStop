require('dotenv').config()
const fs = require('fs')
var S3 = require('aws-sdk/clients/s3');


const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({ region, accessKeyId, secretAccessKey })



exports.uploadFile = function (file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise();
}

exports.getFile = function (fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}

exports.deleteFile = function (fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.deleteObject(deleteParams).promise();
}