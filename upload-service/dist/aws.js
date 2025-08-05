import fs from 'fs';
import pkg from 'aws-sdk';
const { S3 } = pkg;
const s3 = new S3({
    accessKeyId: "fa78b425c6d14eb951319632acc02525",
    secretAccessKey: "046d50ac656521090bcde69ecf037075ff092de3425de1201a02d928afc5c70c",
    endpoint: "https://c93b5765dc3a67221f12a557e6eefb2a.r2.cloudflarestorage.com",
});
export const uploadFile = async (fileName, localFilePath) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName
    }).promise();
    console.log(response);
};
//# sourceMappingURL=aws.js.map