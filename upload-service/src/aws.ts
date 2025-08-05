import fs from 'fs';
import pkg from 'aws-sdk';
const { S3 } = pkg;

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID || "",
  secretAccessKey:process.env.SECRET_ACCESS_KEY || "",
  endpoint:process.env.ENDPOINT || "",
})


export const uploadFile =  async(fileName : string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body : fileContent,
        Bucket : "vercel",
        Key : fileName
    }).promise();
    console.log(response)
}
