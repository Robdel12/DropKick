var PluginError = require('gulp-util').PluginError;
var through2 = require('through2');

var gfDir = require('path').dirname(require('./gulpfile-path'));
var _ = require('lodash');
var relative = _.memoize(_.partial(require('path').relative, gfDir));

exports.failReporter = function () {
  return through2.obj(function (file, enc, done) {
    // something to report and has errors
    if (file.jshint && !file.jshint.success) {
      var errOpt = {
        message: 'JSHint failed for: ' + file.relative,
        showStack: false
      };
      this.emit('error', new PluginError('gulp-jshint', errOpt));
    } else {
      this.push(file);
    }
    done();
  });
};

exports.loadReporter = function (reporter) {
  // we want the function
  if (typeof reporter === 'function') return reporter;

  // object reporters
  if (typeof reporter === 'object' && typeof reporter.reporter === 'function') return reporter.reporter;

  // load jshint built-in reporters
  if (typeof reporter === 'string') {
    try {
      return exports.loadReporter(require('jshint/src/reporters/' + reporter));
    } catch (err) {}
  }

  // load full-path or module reporters
  if (typeof reporter === 'string') {
    try {
      return exports.loadReporter(require(reporter));
    } catch (err) {}
  }
};

exports.reporter = function (reporter, reporterCfg) {
  if (!reporter) reporter = 'default';
  if (reporter === 'fail') {
    return exports.failReporter();
  }
  var rpt = exports.loadReporter(reporter);

  if (typeof rpt !== 'function') {
    throw new PluginError('gulp-jshint', 'Invalid reporter');
  }

  // return stream that reports stuff
  return through2.obj(function (file, enc, done) {
    var opt;
    // something to report and has errors
    if (file.jshint && !file.jshint.success) {
      // merge in reporter config
      opt = _.defaults({}, reporterCfg || {}, file.jshint.opt);

      if (!file.jshint.ignored) {
        rpt(file.jshint.results, file.jshint.data, opt);
      }
    }
    this.push(file);
    done();
  });
};
