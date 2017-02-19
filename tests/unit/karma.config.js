module.exports = function(config) {
    config.set({

        basePath: '',

        // preprocessors: {
        //     'highlighted-section.html': ['ng-html2js']
        // },

        // ngHtml2JsPreprocessor: {
        //     moduleName: 'templates'
        // },

        files: [
            //Bower Components
            '../../bower_components/angular/angular.js',
            '../../bower_components/angular-route/angular-route.js',
            '../../bower_components/angular-mocks/angular-mocks.js',
            // '../../bower_components/angular-cookies/angular-cookies.js',
            // '../../bower_components/DataService/javascript/DataServiceModule.js',
            // '../../bower_components/picturefill/picturefill.js',
            // '../../bower_components/angular-picturefill/angular-picturefill.js',
            // '../../bower_components/angular-socializer/dist/angular-socializer.js',
            // '../../bower_components/moment/moment.js',

            //All componenets controllers and services
            '../../development/app.module.js',
            '../../development/app.routes.js',
            // '../../build/app.config.js',
            '../../development/app.constants.js',
            '../../development/**/*.js',

             // Routes 
            'app.*.spec.js'

            //Directive Template copied in the /unit directory
            // 'template-name.html',

            //Directives
           

            //Controllers
            

            //Services


           
        ],

        autoWatch: false,

        port: 9091,

        singleRun: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-ng-html2js-preprocessor'
        ],

        reporters: ['spec']

    });
};