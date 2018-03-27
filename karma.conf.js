// Karma configuration file
var karma = require('karma');

module.exports = function (karma) {
  var config = {
    singleRun: true,
    autoWatch: false,
    autoWatchInterval: 0,

    // level of logging
    // possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: "warn",

    reporters: ['super-dots', 'mocha'],
    colors: true,
    mochaReporter: {
      output: 'minimal',
    },

    port: 8080,

    // base path, that will be used to resolve files and exclude
    basePath: '.',

    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox'] }
    },

    frameworks: ['jasmine'],

    plugins: [
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-super-dots-reporter'),
      require('karma-mocha-reporter'),
      require('karma-jasmine'),
      require('karma-chrome-launcher')
    ],

    webpack: {
      devtool: 'inline-source-map',

      resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.ts']
      },

      module: {
        loaders: [
          { test: /\.ts$/, loader: "ts-loader" }
        ]
      },

    },

    webpackMiddleware: {
      stats: 'minimal',
    },

    files: ['test/index.js'],

    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },

  };

  karma.set(config);
};
