// load .env so we can use it for browserstack
require('dotenv').config();

module.exports = function(config) {
  config.set({
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
    reporters: ['mocha', 'BrowserStack'],

    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY
    },

    // define browsers
    customLaunchers: {
      iPhone_6sp: {
        base: "BrowserStack",
        "os":"ios",
        "os_version":"9.1",
        "browser":"iphone",
        "device":"iPhone 6S Plus",
        "browser_version":null
      },
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'iPhone_6sp'],

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
      require('karma-browserstack-launcher'),
      require('karma-chrome-launcher')
    ]
  });

  // CI config
  if (process.env.TRAVIS || process.env.CI) {
    config.singleRun = true;
    config.browsers = ['Chrome_travis_ci', 'iPhone_6sp'];
  }
};
