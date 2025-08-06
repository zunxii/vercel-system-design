import fs from 'fs';
import pkg from 'aws-sdk';
const { S3 } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID || "",
  secretAccessKey:process.env.SECRET_ACCESS_KEY || "",
  endpoint:process.env.ENDPOINT || "",
})


export const uploadFile =  async(fileName : string, localFilePath: string) => {
  console.log("ACCESS_KEY_ID:", process.env.ACCESS_KEY_ID);
console.log("SECRET_ACCESS_KEY:", process.env.SECRET_ACCESS_KEY);
console.log("ENDPOINT:", process.env.ENDPOINT);
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body : fileContent,
        Bucket : "vercel",
        Key : fileName
    }).promise();
    console.log(response)
}
