import App from "./app";

/**
 * Async main function wrapper.
 */
(async () => {
    const app = new App();
    await app.init();
    app.start();
})();
