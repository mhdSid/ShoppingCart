/// <reference path="./../../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

	'use strict';

	interface Text {
        shop: string;
    }

	class ShopController {

		private text: Text;

		constructor() {

			this.text = {
                shop: 'Shopping list'
            };
		}
	}
	angular.module('ShoppingCart').controller('ShopController', ShopController);
}