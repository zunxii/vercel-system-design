import { createClient } from 'redis';
import { copyFinalDist, downloadFromS3 } from './aws';
import { buildProject } from './utils';

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main(){
    while(1){
        const response = await subscriber.brPop(
            'build-queue',
            0
        );
        console.log(response);
        const id = response!.element;
        await downloadFromS3(`output/${id}`);
        console.log(`Downloaded files for build ID: ${id}`);
        console.log(`Building project with ID: ${id}`);
        await buildProject(id);
        await copyFinalDist(id);
         publisher.hSet("status", id, "deployed")
    }
}

main()