'use strict';

/* jasmine specs for main controller goes here */
describe("App Controllers", function() {
  //beforeEach(module('ngMockE2E'));
  beforeEach(module('Accordion'));

  var mainCtrl,
      $httpBackend,
      uri,
      response,
      httpHandler,
      options;

  describe("Main Controller", function() {
    beforeEach(inject(function($controller, $injector) { //or _ServiceName_

      response = {
        data: {
          body: "a text"
        }
      };

      $httpBackend = $injector.get("$httpBackend");
      httpHandler = $httpBackend.when('GET', uri).respond(200, response.data.body); // respond() takes whatever args

      options = $injector.get('__OPTIONS__');
      uri = options.__dummyDataUrl__  + '/1';
      //console.log(options)
      
      //$scope = $rootScope.$new();

      mainCtrl = function() {
        return $controller('MainController', {
                $injector: $injector
              });
      }

    }));

    afterEach(function() {
        //Verifies that all of the requests defined via the expect api were made.
        $httpBackend.verifyNoOutstandingExpectation();

        //Verifies that there are no outstanding requests that need to be flushed.
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should request text and assert if true", function() {

        $httpBackend.expectGET(uri).respond(200, response.data.body);

        var ctrl = mainCtrl();
        $httpBackend.flush();

        expect(ctrl.url).toEqual(uri);
        expect(ctrl.index).toEqual(1);
        expect(ctrl.data).toEqual(response.data.body);
        expect(ctrl.error).toBe(undefined);
    });

    it('should fail request and asset false', function() {
        httpHandler.respond(400, '');

        $httpBackend.expectGET(uri).respond(400, response.data.body);

        var ctrl = mainCtrl();
        $httpBackend.flush();

        expect(ctrl.error).toEqual(response.data.body);
        expect(ctrl.data).toBe(undefined);
    });
  });
});
