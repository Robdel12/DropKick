var gulp = require('gulp'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minimist = require('minimist'),
    deploy = require('gulp-gh-pages'),
    merge = require('merge-stream');

// Passing a version number
var knownOptions = {
  string: 'ver'
};
var options = minimist(process.argv.slice(2), knownOptions);

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

gulp.task('rename-release', function() {
  return gulp.src('dropkick.js')
    .pipe(rename('dropkick.' + options.ver + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('production/'));
});

gulp.task('gh-pages', function () {
  return gulp.src('/build')
    .pipe(deploy());
});

gulp.task('build', function() {
  return gulp.src('dropkick.js')
    .pipe(rename('dropkick.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('dropkick.js', ['lint', 'scripts']);
  gulp.watch('css/*.scss', ['sass']);
});

gulp.task('test', function() {
  //TODO: fix
  // return gulp.src(['./tests/src/runner.html', './tests/src/iframe.html'])
  return gulp.src(['./tests/src/runner.html'])
    .pipe(qunit());
});
