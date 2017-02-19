exports.config = {

    onPrepare: function() {
        var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'all'
            // spec: {
            //     displayPending: true,
            //     displayStacktrace: 'all'
            // }
        }));
    },

    seleniumAddress: 'http://localhost:4444/wd/hub',

    //seleniumServerJar: '../node_modules/protractor/built/selenium-webdriver/selenium-server-standalone-2.45.0.jar'

    specs: [
        'scenarios.js'
    ],

    capabilities: {
        'browserName': 'firefox' //chrome
    },

    //chromeOnly: true,

    baseUrl: 'http://localhost:9090/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        print: function() {}
    },

    reporters: ['spec']
};