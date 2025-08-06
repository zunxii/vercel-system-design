"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = buildProject;
const child_process_1 = require("child_process");
const path = require("path");
function buildProject(id) {
    return new Promise((resolve) => {
        const child = (0, child_process_1.exec)(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`);
        child.stdout?.on('data', function (data) {
            console.log(data);
        });
        child.stderr?.on('data', function (data) {
            console.log(data);
        });
        child.on('close', function (code) {
            console.log(`Child process exited with code ${code}`);
            resolve("");
        });
    });
}
//# sourceMappingURL=utils.js.map