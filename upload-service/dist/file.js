import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
export const getAllfiles = (folderPath) => {
    const response = [];
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        // const name = `${folderPath}/${file}`;
        const fullFileName = path.join(folderPath, file);
        if (fs.statSync(fullFileName).isDirectory()) {
            // console.log(name);
            response.push(...getAllfiles(fullFileName));
        }
        else {
            response.push(fullFileName);
        }
    });
    return response;
};
//# sourceMappingURL=file.js.map