import { exec } from 'child_process';
import * as path from 'path';

export function buildProject(id : string){
    return new Promise((resolve) => {
      const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`);

      child.stdout?.on('data', function(data){
        console.log(data);
      })
      child.stderr?.on('data', function(data){
        console.log(data);
      });
      child.on('close', function(code){
        console.log(`Child process exited with code ${code}`);
        resolve("");
      })
    }
    )
}