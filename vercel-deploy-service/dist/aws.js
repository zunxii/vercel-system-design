"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFromS3 = downloadFromS3;
exports.copyFinalDist = copyFinalDist;
const aws_sdk_1 = require("aws-sdk");
const path = require("path");
const fs = require("fs");
const s3 = new aws_sdk_1.S3({
    accessKeyId: "fa78b425c6d14eb951319632acc02525",
    secretAccessKey: "046d50ac656521090bcde69ecf037075ff092de3425de1201a02d928afc5c70c",
    endpoint: "https://c93b5765dc3a67221f12a557e6eefb2a.r2.cloudflarestorage.com"
});
async function downloadFromS3(prefix) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix
    }).promise();
    const allPromises = allFiles.Contents?.map(async ({ Key }) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercel",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            });
        });
    }) || [];
    console.log("Downloading files from S3...");
    await Promise.all(allPromises?.filter(x => x !== undefined));
}
async function copyFinalDist(id) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllfiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length - 1), file);
    });
}
const uploadFile = async (fileName, localFilePath) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName
    }).promise();
    console.log(response);
};
const getAllfiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllfiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
//# sourceMappingURL=aws.js.map