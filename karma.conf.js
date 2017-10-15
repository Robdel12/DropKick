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
      windows7_chrome50: {
        base: "BrowserStack",
        "os":"Windows",
        "os_version":"7",
        "browser":"chrome",
        "device":null,
        "browser_version":"50.0"
      },
      windows7_ff50: {
        base: "BrowserStack",
        "os":"Windows",
        "os_version":"7",
        "browser":"firefox",
        "device":null,
        "browser_version":"50.0"
      },
      windows7_ie11: {
        base: "BrowserStack",
        "os":"Windows",
        "os_version":"7",
        "browser":"ie",
        "device":null,
        "browser_version":"11"
      },
      osxMav_chrome50: {
        base: "BrowserStack",
        "os":"OS X",
        "os_version":"Mavericks",
        "browser":"chrome",
        "device":null,
        "browser_version":"50.0"
      },
      osxMav_ff50: {
        base: "BrowserStack",
        "os":"OS X",
        "os_version":"Mavericks",
        "browser":"firefox",
        "device":null,
        "browser_version":"50.0"
      },
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

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

  if (process.env.BROWSER_STACK) {
    config.browsers.push(
      'iPhone_6sp',
      'windows7_ie11',
      'windows7_chrome50',
      'windows7_ff50',
      'osxMav_chrome50',
      'osxMav_ff50'
    );
  }
};
