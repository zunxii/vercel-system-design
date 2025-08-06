"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const aws_1 = require("./aws");
const utils_1 = require("./utils");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const publisher = (0, redis_1.createClient)();
publisher.connect();
async function main() {
    while (1) {
        const response = await subscriber.brPop('build-queue', 0);
        console.log(response);
        const id = response.element;
        await (0, aws_1.downloadFromS3)(`output/${id}`);
        console.log(`Downloaded files for build ID: ${id}`);
        console.log(`Building project with ID: ${id}`);
        await (0, utils_1.buildProject)(id);
        await (0, aws_1.copyFinalDist)(id);
        publisher.hSet("status", id, "deployed");
    }
}
main();
//# sourceMappingURL=index.js.map