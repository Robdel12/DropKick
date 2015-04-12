var gulp = require('gulp-npm-run')(require('gulp'), {
      exclude: ['test'],
      require: ['docs']
    }),
    del = require('del'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence');

gulp.task('default', ['sass', 'test', 'scripts', 'docs']);

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
  gulp.watch('dropkick.js', ['scripts']);
  gulp.watch('css/*.scss', ['sass']);
});

gulp.task("docs-rename", function() {
  return del(['./docs/index.html'], function (err, deletedFiles) {
    return gulp.src('./docs/classes/Dropkick.html')
        .pipe(rename('index.html'))
        .pipe(replace("../", ''))
        .pipe(gulp.dest('./docs/'));
  });
});

gulp.task('test', function() {
  // return gulp.src(['./tests/src/runner.html', './tests/src/iframe.html'])
  return gulp.src(['./tests/src/runner.html'])
    .pipe(qunit());
});
