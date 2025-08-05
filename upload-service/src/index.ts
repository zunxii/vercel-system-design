import express from "express";
import cors from "cors"
import {simpleGit} from "simple-git";
import { generate } from "./utils.js";
import { getAllfiles } from "./file.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploadFile } from "./aws.js";
import { createClient } from "redis";


const publisher = createClient();
publisher.connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
// uploadFile('dist/output/5f0la/components/ui/input.tsx','/home/zunxii/vercel/dist/output/5f0la/components/ui/input.tsx')

app.post("/deploy",async (req, res) =>  {
    const repoUrl = req.body.repoUrl; 
    // console.log(repoUrl);
    const id = generate();
    const repoPath = path.join(__dirname,`output/${id}`)
    await simpleGit().clone(repoUrl, repoPath);
    const files = getAllfiles(repoPath);
    files.forEach(async (file)=>{
        await uploadFile(file.slice(__dirname.length + 1), file);
    })

    publisher.lPush("build-queue",id);
    res.json({
        id:id
    })
})

app.listen(3000)

