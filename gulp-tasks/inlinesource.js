module.exports = function() {
    const gulp = require('gulp');
    const util = require('gulp-util');
    const inlinesource = require('gulp-inline-source');
    const zip           = require('gulp-zip');
    const checkFileSize = require('gulp-check-filesize');

    const config = util.env.boilerplate.config;
    const inlinesourceConfig = config.tasks.inlinesource;
    
    gulp.task('inlinesource', function () {
        return gulp.src(config.destinationRoot + inlinesourceConfig.source)
            .pipe(inlinesource())
            .pipe(zip(inlinesourceConfig.filename))
            .pipe(gulp.dest(inlinesourceConfig.destination))
            .pipe(checkFileSize({
                fileSizeLimit: 16384
            }));
    });
};