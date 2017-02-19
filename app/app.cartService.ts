/// <reference path="./../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

	'use strict';

	class Cart {
		
		public totalPrice: number;
		public cartItems: Array<any>;
		private localStorage: any;
		private stringify: any;
		private parse: any;
		private splice: any;
		private push: any;

		static $inject = ['$rootScope'];

		constructor(private $rootScope: ng.IRootScopeService) {
			this.localStorage = window.localStorage;
			this.stringify = JSON.stringify;
			this.parse = JSON.parse;
			this.push = Array.prototype.push;
			this.splice = Array.prototype.splice;
			this.cartItems = [];
			this.totalPrice = 0;

			if (this.localStorage.length > 0) {

				angular.forEach(this.localStorage, (item: any, key: number) => {

					let localItem: any = this.parse(item);

					if (localItem.id) {
						this.cartItems.push(localItem);
					}
					else {
						this.totalPrice = Number(localItem);
					}
				});

			}
		}


		emitEvent(name, obj): any {
			this.$rootScope.$broadcast(name, obj);
		}


		updateTotalPrice(type: string, itemPrice: any): void {

			let localItem: Object;

			switch(type) {

	            case 'minus':
	                this.totalPrice = this.totalPrice - Number(itemPrice);
	                this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });
	                localItem = {
	                	totalPrice: this.totalPrice
	                };
	                this.updateLocalStorageItem(localItem);
	                break;

	            case 'plus':
	                this.totalPrice = this.totalPrice + Number(itemPrice);
	                this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });
	                localItem = {
	                	totalPrice: this.totalPrice
	                };
	                this.updateLocalStorageItem(localItem);
	                break;

	            default: 
	                break;
	        }
		}


		addToCart(item: any, index: number): void {

			let isthere: boolean = false;
			let localItem: Object;

			angular.forEach(this.cartItems, (cartItem, key) => {
				if (item.id === cartItem.id) {
					isthere = true;
				}
			});

			if (!isthere) {

				this.cartItems.push(item);

				this.totalPrice +=  Number(item.originalPrice) * Number(item.quantity);

				this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });

				this.createLocalStorageItem(item);
			}
			else {

				this.cartItems[index].quantity = Number(this.cartItems[index].quantity) + Number(item.quantity);

				this.cartItems[index].price =  Number(this.cartItems[index].price) + Number(item.originalPrice) * Number(item.quantity);

				this.totalPrice +=  Number(item.originalPrice) * Number(item.quantity);

				this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });

				this.updateLocalStorageItem(item);
			}

			localItem = {
            	totalPrice: this.totalPrice
            };

            this.updateLocalStorageItem(localItem);
		}


		removeFromCart(index: number): void {

			this.totalPrice = this.totalPrice - Number(this.cartItems[index].price);

			this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });

			this.deleteLocalStorageItem(this.cartItems[index]);

			this.cartItems.splice(index, 1);
		}


		createLocalStorageItem(item: any): void {
			console.log(item)
			if (this.localStorage) {
				let localItem: any = this.parse(this.localStorage.getItem(item.id));
				if (!localItem) {
					this.localStorage.setItem(item.id, this.stringify(item));
				}	
			}
		}	


		updateLocalStorageItem(item: any): void {
			if (this.localStorage) {
				if (item.id) {
					let localItem: any = this.parse(this.localStorage.getItem(item.id));
					if (localItem) {
						this.localStorage.setItem(item.id, this.stringify(item));
					}	
				} else if (item.totalPrice) {
					this.localStorage.setItem('totalPrice', item.totalPrice);
				}
			}
		}


		deleteLocalStorageItem(item: any): void {
			if (this.localStorage) {
				this.localStorage.clear(item.id);
			}
		}
	}
	angular.module('ShoppingCart').service('Cart', Cart);
}