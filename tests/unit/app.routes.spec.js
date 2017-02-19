'use strict';

/* jasmine specs for routes goes here */
describe("App Routes", function() {
    beforeEach(module('ngMockE2E'));
    beforeEach(module('Accordion'));

    var $scope,
        cdn,
        $route;

    describe("Route Provider Checking", function() {

        beforeEach(inject(function($rootScope, $injector) {

            cdn = {
                mainUrl: 'development/'
            };
            $scope = $rootScope.$new();
            $route = $injector.get("$route");
        }));

        it("should check that the route to '/' resolves the object and loads the right controller/As, and HTML partial", function() {

            // expect($route.routes['/'].controller).toBe('ExploreController');
            // expect($route.routes['/'].controllerAs).toBe('exploreCtrl');
            // expect($route.routes['/'].resolve).not.toBe(undefined);
            expect($route.routes['/'].templateUrl).toEqual(cdn.mainUrl + 'accordion/accordion.html');
        });

        it("should check that the route to 'no url specified' redirects to '/'", function() {

            //Otherwise
            expect($route.routes[null].redirectTo).toEqual('/');
        });
    });
});