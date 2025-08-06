"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new aws_sdk_1.S3({
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    endpoint: process.env.ENDPOINT || ""
});
const app = (0, express_1.default)();
app.get("*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type);
    res.send(contents.Body);
});
app.listen(3001);
//# sourceMappingURL=index.js.map