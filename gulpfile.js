var gulp = require('gulp'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', ['sass', 'test', 'scripts']);

// Lint Task
gulp.task('lint', function() {
  return gulp.src('dropkick.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('production/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('dropkick.js')
    .pipe(rename('dropkick.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('production/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('dropkick.js', ['lint', 'scripts']);
  gulp.watch('css/*.scss', ['sass']);
});

gulp.task('test', function() {
  // return gulp.src(['./tests/src/runner.html', './tests/src/iframe.html'])
  return gulp.src(['./tests/src/runner.html'])
    .pipe(qunit());
});
