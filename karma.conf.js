module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // files to watch
    files: [
      'tests/*-test.js',
      'dist/dropkick.css'
    ],

    // processors per file
    preprocessors: {
      'tests/*-test.js': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // webpack configuration
    webpack: require('./webpack.config.js'),

    // webpack-dev-middleware config
    webpackMiddleware: {
      stats: 'errors-only'
    },

    // enable our plugins
    plugins: [
      require('karma-mocha'),
      require('karma-webpack'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher')
    ]
  });

  // CI config
  if (process.env.TRAVIS || process.env.CI) {
    config.singleRun = true;
    config.browsers = ['Chrome_travis_ci'];
  }
};
