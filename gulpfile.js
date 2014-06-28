var gulp = require('gulp'),
    qunit = require('gulp-qunit');

gulp.task('default', function() {
    return gulp.src('./tests/src/runner.html')
        .pipe(qunit());
});

gulp.task('test', function() {
    return gulp.src('./tests/src/runner.html')
        .pipe(qunit());
});
