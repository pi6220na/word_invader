module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],

    files: [
      'test/client/utils.test.js',       // unit test files
      'public/javascripts/utils.js'  // files to test
    ]
  });

};
