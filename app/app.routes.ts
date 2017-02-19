/// <reference path="./../tools/typings/angularjs/angular.d.ts" />
((): void => {
    angular.module('ShoppingCart').config(configFn);
    configFn.$inject = ['$routeProvider', '$locationProvider', 'cdn']
    function configFn($routeProvider: any, $locationProvider: any, cdn): any {
        $locationProvider.html5Mode(true);
        $routeProvider
        .when('/',
        {
            //templateUrl: cdn.mainUrl + 'Shop/shop.html'
            templateUrl: cdn.mainUrl + 'Cart/cart.html',
            controller: 'CartController',
            controllerAs: 'cartCtrl'
        })
        .when('/shop',
        {
            templateUrl: cdn.mainUrl + 'Shop/shop.html',
            controller: 'ShopController',
            controllerAs: 'shopCtrl'
        })
        .when('/checkout',
        {
            templateUrl: cdn.mainUrl + 'Checkout/checkout.html',
            controller: 'CheckoutController',
            controllerAs: 'checkoutCtrl',
            pageClass: 'page-checkout'
        })
        // .when('/cart',
        // {
        //     templateUrl: cdn.mainUrl + 'Cart/cart.html',
        //     controller: 'CartController',
        //     controllerAs: 'cartCtrl'
        // })
        .otherwise({
            redirectTo: '/'
        });
    };
})();
