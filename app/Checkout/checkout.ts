/// <reference path="./../../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

	'use strict';

	interface Text {
        checkout: string;
        cart: string;
        customerInfo: string;
        shippingInfo: string;
        proceed: string;
        goToCard: string;
    }

    interface User {
    	firstName: string;
    	lastName: string;
    	email: string;
    	appartment?: string;
    	address: string;
    	city: string;
    	country: string;
    	postalCode: number;
    	paymentAmount: number;
    }

	class CheckoutController {

		private text: Text;
		private cartItems: any;
		private initLoader: boolean;
		private totalPrice: number;
		private userData: User;

		static $inject = ['Cart', '$scope', '$location']

		constructor(private Cart: any, private $scope: ng.IScope, private $location: ng.ILocationService) {

			this.text = {
                checkout: 'Checkout',
                cart: 'Your cart',
                customerInfo: 'Customer Information',
                shippingInfo: 'Shipping Information',
                proceed: 'Proceed',
                goToCard: 'Go to card'
            };

            this.userData = {
            	firstName: '',
            	lastName: '',
            	email: '',
            	appartment: '',
            	address: '',
            	city: '',
            	country: '',
            	postalCode: null,
            	paymentAmount: 0
            };

            this.cartItems = this.Cart.cartItems;
            this.totalPrice = this.Cart.totalPrice;

            this.$scope.$on('totalPrice::change', (e: ng.IAngularEvent, data: any) => {

                this.totalPrice = Number(data.totalPrice);
            });

            this.initLoader = true;
		}

		loaderCallback(): void {
			this.cartItems = [];
			this.$location.path('/cart');
		}

		proceed(): void {
			if (this.userData.email && this.userData.email !== '' 
				&& this.userData.firstName && this.userData.firstName !== ''
				&& this.userData.lastName && this.userData.lastName !== ''
				&& this.userData.address && this.userData.address !== ''
				&& this.userData.city && this.userData.city !== ''
				&& this.userData.country && this.userData.country !== ''
				&& this.userData.postalCode && this.userData.postalCode !== 0
				&& this.userData.paymentAmount && this.userData.paymentAmount !== 0)

			this.userData.paymentAmount = this.Cart.totalPrice;

			console.log(this.userData)
		}
	}
	angular.module('ShoppingCart').controller('CheckoutController', CheckoutController);
}