import * as http from "http";

/**
 * Function for graphql resolvers.
 * This function provides additional access to the request and response object.
 * Each field defined in the schema should be resolved by a function or static value here.
 * More information: {@link https://graphql.org/graphql-js/running-an-express-graphql-server/}
 * @param req
 * @param res
 */
export function resolvers(req: http.IncomingMessage, res: http.OutgoingMessage) {
    return {
        /**
         * Example resolver for the example time query field.
         */
        time() {
            return (new Date()).toString();
        }
    }
}
