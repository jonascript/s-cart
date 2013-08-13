


module.exports = function(config) {
    config.set({
      basePath : '../',
      plugins: [
        // these plugins will be require() by Karma
        'karma-jasmine',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-safari-launcher'
      ],
      files : [
        'app/lib/angular/angular.js',
        'app/lib/angular/angular-*.js',
        'test/lib/angular/angular-mocks.js',
        'app/js/products-test.json',
        'app/js/cart-test.json',
        'app/js/**/*.js',
        'test/unit/**/*.js'
      ],

      frameworks: ['jasmine'],

      autoWatch : true,

      browsers : ['Chrome', 'Firefox', 'Safari'],

      junitReporter : {
        outputFile: 'test_out/unit.xml',
        suite: 'unit'
      }
    });
  };