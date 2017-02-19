	
'use strict';

describe("Test App", function() {

	it('should redirect to index.html', function() {

        browser.get('/').then(function(url) {

             getLocationAbsUrlNdExpect('/');

        });
    });

    it('should click on an element', function() {

    	isNotPresent('.accordion-section-0');

    	elementClickCallBack('.accordion-input', function() {

    		isPresent('.accordion-section-0');

    	});
    });

 	describe('angularjs homepage todo list', function() {

	  	it('should redirect to angularjs homepage, add a todo item, then remove it from the list', function() {

	    	browser.get('https://angularjs.org');



		    element(by.model('todoList.todoText')).sendKeys('write first protractor test');

		    element(by.css('[value="add"]')).click();
		



		    var todoList = element.all(by.repeater('todo in todoList.todos'));

		    expect(todoList.count()).toEqual(3);

		    expect(todoList.get(2).getText()).toEqual('write first protractor test');




		    todoList.get(2).element(by.css('input')).click();

		    var completedAmount = element.all(by.css('.done-true'));

		    expect(completedAmount.count()).toEqual(2);
		});
	});
});



function getLocationAbsUrlNdExpect(path) {

    browser.getLocationAbsUrl().then(function(url) {

        expect(url).toEqual(path);

        console.log("Current location is " + url);

    });
}

/*
 * @function: elementClickCallBack
 *
 * Click on an element and issue a callback call after the click event is done
 */
function elementClickCallBack(elementClass, callback) {

    element.all(by.css(elementClass)).first().click().then(callback);

}


function checkElementisDisplayed(elementClass) {

	element.all(by.css(elementClass)).first().isDisplayed().toBeTruthy();

}


/*
 * @function: isPresent
 *
 * Check if an element is present or not, then make sure if the class to be attached is already attached or not
 */
function isPresent(className) {

    expect(element(by.css(className)).isPresent()).toBeTruthy();

    element(by.css(className)).getText().then(function(val) {
    	console.log(val)
    });

}

/*
 * @function: isPresent
 *
 * Check if an element is present or not, then make sure if the class to be attached is already attached or not
 */
function isNotPresent(className) {

    expect(element(by.css(className)).isDisplayed()).toBeFalsy(); //toB

}

