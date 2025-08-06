import express from "express";
import cors from "cors";
import { simpleGit } from "simple-git";
import { generate } from "./utils.js";
import { getAllfiles } from "./file.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploadFile } from "./aws.js";
import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();
// console.log("ACCESS_KEY_ID:", process.env.ACCESS_KEY_ID);
// console.log("SECRET_ACCESS_KEY:", process.env.SECRET_ACCESS_KEY);
// console.log("ENDPOINT:", process.env.ENDPOINT);
const subscriber = createClient();
subscriber.connect();
const publisher = createClient();
publisher.connect();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
// uploadFile('dist/output/5f0la/components/ui/input.tsx','/home/zunxii/vercel/dist/output/5f0la/components/ui/input.tsx')
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    // console.log(repoUrl);
    const id = generate();
    const repoPath = path.join(__dirname, `output/${id}`);
    await simpleGit().clone(repoUrl, repoPath);
    const files = getAllfiles(repoPath);
    files.forEach(async (file) => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    res.json({
        id: id
    });
});
app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id);
    res.json({
        status: response
    });
});
app.listen(3000);
//# sourceMappingURL=index.js.map