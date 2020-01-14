// tslint:disable:no-console
process.env.NODE_CONFIG_DIR = __dirname + "/../config";
import App from "./app";
const numCPUs = require("os").cpus().length;
import * as cluster from "cluster";

if (cluster.isMaster) {

    console.log(`[CLUSTER-M] Master ${process.pid} is running`);
    cluster.settings.silent = true;

    cluster.on("exit", (worker, code) => {
        console.error(`[CLUSTER-M] Worker ${worker.id} died! (code: ${code})`);
        console.log("[CLUSTER-M] Starting new worker");
        cluster.fork();
    });
    cluster.on("online", (worker) => {
        worker.process.stdout.on("data", (data) => {
            process.stdout.write(`[CLUSTER-${worker.id}] ${data}`);
        });
    });

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    /**
     * Async main function wrapper.
     */
    (async () => {
        const app = new App();
        await app.init();
        app.start();
    })();
}
