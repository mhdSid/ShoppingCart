/// <reference path="../../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

	interface Text {
        button: string;
    }

    class ShopComponentController  { 

        private data: any;
		private error: any;
		private doneFetching: boolean;
		private text: Text;

        static $inject = ['DataFeftcher', 'Cart'];

        constructor(private DataFeftcher: any, private Cart: any) {}

        $onInit(): void {

        	this.text = {
        		button: 'ADD TO CART!'
        	};

        	this.doneFetching = false;

			this.DataFeftcher.getData('./development/Shop/shop.json').then(
				data => {
					this.data = data.data;
					this.doneFetching = true;
				},
				reason => {
					this.error = reason;
				}
			);
        }


		addToCart(index: number): void {

			let data: any = angular.copy(this.data);
			this.Cart.addToCart(data[index], index);
		}
    }


    class ShopComponent {
 
        private controller: any;
        private templateUrl: string;
 
        constructor() {          
	        this.templateUrl = './development/Shop/shop-component.html';
	        this.controller = ShopComponentController;
        }
    }


    angular.module('ShoppingCart').component('shop', new ShopComponent())
}