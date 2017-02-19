/// <reference path="./../../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

	'use strict';

	interface Text {
        checkout: string;
        cart: string;
    }

	class CartController {

		private text: Text;
		private cartItems: any;
		private totalPrice: number;

		static $inject = ['Cart']

		constructor(private Cart: any) {

			this.text = {
                checkout: 'Checkout  ',
                cart: 'Your cart'
            };

            this.cartItems = this.Cart.cartItems;

            this.totalPrice = this.Cart.totalPrice;
		}
	}
	angular.module('ShoppingCart').controller('CartController', CartController);
}