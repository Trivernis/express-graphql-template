const {src, dest, watch, series, task} = require('gulp');
const ts = require('gulp-typescript');
const del = require('delete');

/**
 * Clears the dist folder by deleting all files inside.
 * @param cb
 */
function clearDist(cb) {
    del('dist/*', cb);
}

/**
 * Typescript compilation task.
 * @returns {*}
 */
function compileTypescript() {
    let tsProject = ts.createProject('tsconfig.json');
    let tsResult = tsProject.src().pipe(tsProject());
    return tsResult
    //.pipe(minify())
        .pipe(dest('dist'));
}

/**
 * Task for moving all remaining file from source to dist that don't need procession.
 * @returns {*}
 */
function moveRemaining() {
    return src(['src/**/*', '!src/**/*.ts'])
        .pipe(dest('dist'));
}

task('default', series(clearDist, compileTypescript, moveRemaining));

task('watch', () => {
    watch('**/*.ts', compileTypescript);
    watch(['src/**/*', '!src/**/*.ts'], moveRemaining());
});
