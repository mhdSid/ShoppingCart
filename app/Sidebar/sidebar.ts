/// <reference path="../../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

    interface Text {
        bag: string;
        shop: string;
        checkout: string;
    }

    class SideBarController  { 

        private text: Text;
        private bagItems: Array<any>;
        private totalPrice: number;

        static $inject = ['Cart', '$scope'];

        constructor(private Cart: any, private $scope: ng.IScope) {}

        $onInit(): void {

            this.text = {
                bag: 'Your Bag',
                shop: 'Shop',
                checkout: 'Checkout'
            };

            this.bagItems = this.Cart.cartItems;
            this.totalPrice = Number(this.Cart.totalPrice);

            this.$scope.$on('totalPrice::change', (e: ng.IAngularEvent, data: any) => {

                this.totalPrice = Number(data.totalPrice);
            });
        }

        removeFromCart(index: number): void {
            this.Cart.removeFromCart(index);
        }
    }

    class Sidebar {

        private restrict: string;
        private replace: boolean;
        private templateUrl: string;
        private controller: any;
        private controllerAs: string;

        constructor() {

            this.restrict = 'E';

            this.templateUrl = './development/Sidebar/sidebar.html';

            this.controller = SideBarController;

            this.controllerAs = '$ctrl';
        }
    }

    angular.module('ShoppingCart')

    .directive('sidebar', () => {
        return new Sidebar();
    });
}