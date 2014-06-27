var gulp = require('gulp'),
    qunit = require('gulp-qunit');

gulp.task('default', function() {
    return gulp.src('./tests/unit/unittests_nupic-js.html')
        .pipe(qunit());
});
