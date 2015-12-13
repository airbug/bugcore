/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var gulp        = require('gulp');
var eslint      = require('gulp-eslint');
var gulpUtil    = require('gulp-util');


//-------------------------------------------------------------------------------
// Gulp Tasks
//-------------------------------------------------------------------------------

gulp.task('default', function() {
    return gulp.src(['libraries/bugcore/js/**/*.js','!node_modules/**'])

});

gulp.task('lint', function () {
    return gulp.src([
            'libraries/bugcore/js/**/*.js',
            '!node_modules/**'
        ])
        .pipe(eslint())
        // format one at time since this stream may fail before it can format them all at the end
        .pipe(eslint.formatEach())
        // failOnError will emit an error (fail) immediately upon the first file that has an error
        .pipe(eslint.failOnError())
        // need to do something before the process exits? Try this:
        .on('error', function(error) {
            gulpUtil.log('Stream Exiting With Error');
        });
});

gulp.task('lint-watch', function() {
    // Lint only files that change after this watch starts
    var lintAndPrint = eslint();
    // format results with each file, since this stream won't end.
    lintAndPrint.pipe(eslint.formatEach());

    return gulp.watch('libraries/bugcore/js/**/*.js', function(event) {
        if (event.type !== 'deleted') {
            gulp.src(event.path)
                .pipe(lintAndPrint, {end: false});
        }
    });
});
