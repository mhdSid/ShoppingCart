/// <reference path="../../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

    interface Text {
        bag: string;
        shop: string;
    }

    class Quantity {

        private restrict: string;
        private replace: boolean;
        private templateUrl: string;
        private link: Object;
  
        static $inject = ['Cart'];

        constructor(private Cart: any) {

            this.restrict = 'E';

            this.templateUrl = './development/Quantity/qtt.html';

            this.link = {
                pre: this.preLink
            };
        }

        preLink($scope: any, $element: ng.IAugmentedJQuery, $attrs: any): void {

            $scope.changeQuantity = changeQuantity;

            let updateTotal = $attrs.updateTotal;

            let __this: any = this;

            function changeQuantity(type: string): void {

                switch(type) {

                    case 'minus':

                        --$scope.item.quantity;
                        if ($scope.item.quantity <= 0) {
                            $scope.item.quantity = 1;
                        } else {
                            $scope.item.price = Number($scope.item.price ) - Number($scope.item.originalPrice);
                            checkUpdateTotal('minus');
                        }
                        break;

                    case 'plus':

                        ++$scope.item.quantity;
                        $scope.item.price = Number($scope.item.price ) + Number($scope.item.originalPrice);
                        checkUpdateTotal('plus');
                        break;

                    default: 
                        break;
                }

                function checkUpdateTotal(type): void {
                    if (updateTotal) {
                        __this.Cart.updateTotalPrice(type, $scope.item.originalPrice);   
                        __this.Cart.updateLocalStorageItem($scope.item);                       
                    }
                }
            }
        }
    }

    angular.module('ShoppingCart')

    .directive('quantity', (Cart: any) => {
        return new Quantity(Cart);
    });
}