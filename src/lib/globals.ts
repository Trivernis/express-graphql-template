import * as config from "config";
import * as winston from "winston";

/**
 * Defines global variables to be used.
 */
namespace globals {
    export const logger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    winston.format.printf(({ level, message, timestamp }) => {
                        return `${timestamp} ${level}: ${message}`;
                    }),
                ),
                level: config.get("logging.loglevel"),
            }),
        ],
    });
}

export default globals;
