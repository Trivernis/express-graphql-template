import * as compression from "compression";
import * as config from "config";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import {buildSchema} from "graphql";
import {importSchema} from "graphql-import";
import * as http from "http";
import * as path from "path";
import {resolvers} from "./graphql/resolvers";
import globals from "./lib/globals";

const logger = globals.logger;

/**
 * Main class of the application server.
 */
class App {
    public app: express.Application;
    public server: http.Server;

    /**
     * Constructor
     * creates a new app and server for the app.
     */
    constructor() {
        this.app = express();
        this.server = new http.Server(this.app);
    }

    /**
     * Initializes everything that needs to be initialized (can be asynchronous).
     * If database connections need to be established you would handle that here.
     */
    public async init() {
        this.app.set("trust proxy", 1);

        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use((req, res, next) => {
            logger.verbose(`${req.method} ${req.url}`);
            next();
        });
        this.app.use("/graphql",  graphqlHTTP((request, response) => {
            return {
                graphiql: config.get("graphql.graphiql"),
                rootValue: resolvers(request, response),
                schema: buildSchema(importSchema(path.join(__dirname, "./graphql/schema.graphql"))),
            };
        }));
    }

    /**
     * Starts the web server.
     */
    public start() {
        if (config.has("server.port")) {
            logger.info(`Starting server...`);
            this.app.listen(config.get("server.port"));
            logger.info(`Server running on port ${config.get("server.port")}`);
        } else {
            logger.error("No port specified in the config." +
                "Please configure a port in the config.yaml.");
        }
    }
}

export default App;
