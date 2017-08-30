module.exports = function() {
    const gulp = require('gulp');
    const util = require('gulp-util');
    const concat = require('gulp-concat');
    const gulpif = require('gulp-if');
    const browserSync = require('browser-sync');

    const isWatching = ['serve', 'watch'].indexOf(process.argv[2]) >= 0;
    const config = util.env.boilerplate.config;
    const concatConfig = config.tasks.concat;
    gulp.task('concat', function () {
        return gulp.src(concatConfig.source, {cwd: config.sourceRoot})
            .pipe(concat(concatConfig.filename))
            .pipe(gulp.dest(config.destinationRoot + concatConfig.destination))
            .pipe(gulpif(isWatching, browserSync.stream({once: true})))
    });
};