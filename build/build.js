(function () {
    angular.module('ShoppingCart', ['ngRoute']);
})();

var ShoppingCart;
(function (ShoppingCart) {
    'use strict';
    var Cart = (function () {
        function Cart($rootScope) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.localStorage = window.localStorage;
            this.stringify = JSON.stringify;
            this.parse = JSON.parse;
            this.push = Array.prototype.push;
            this.splice = Array.prototype.splice;
            this.cartItems = [];
            this.totalPrice = 0;
            if (this.localStorage.length > 0) {
                angular.forEach(this.localStorage, function (item, key) {
                    var localItem = _this.parse(item);
                    if (localItem.id) {
                        _this.cartItems.push(localItem);
                    }
                    else {
                        _this.totalPrice = Number(localItem);
                    }
                });
            }
        }
        Cart.prototype.emitEvent = function (name, obj) {
            this.$rootScope.$broadcast(name, obj);
        };
        Cart.prototype.updateTotalPrice = function (type, itemPrice) {
            var localItem;
            switch (type) {
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
        };
        Cart.prototype.addToCart = function (item, index) {
            var isthere = false;
            var localItem;
            angular.forEach(this.cartItems, function (cartItem, key) {
                if (item.id === cartItem.id) {
                    isthere = true;
                }
            });
            if (!isthere) {
                this.cartItems.push(item);
                this.totalPrice += Number(item.originalPrice) * Number(item.quantity);
                this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });
                this.createLocalStorageItem(item);
            }
            else {
                this.cartItems[index].quantity = Number(this.cartItems[index].quantity) + Number(item.quantity);
                this.cartItems[index].price = Number(this.cartItems[index].price) + Number(item.originalPrice) * Number(item.quantity);
                this.totalPrice += Number(item.originalPrice) * Number(item.quantity);
                this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });
                this.updateLocalStorageItem(item);
            }
            localItem = {
                totalPrice: this.totalPrice
            };
            this.updateLocalStorageItem(localItem);
        };
        Cart.prototype.removeFromCart = function (index) {
            this.totalPrice = this.totalPrice - Number(this.cartItems[index].price);
            this.emitEvent('totalPrice::change', { totalPrice: this.totalPrice });
            this.deleteLocalStorageItem(this.cartItems[index]);
            this.cartItems.splice(index, 1);
        };
        Cart.prototype.createLocalStorageItem = function (item) {
            console.log(item);
            if (this.localStorage) {
                var localItem = this.parse(this.localStorage.getItem(item.id));
                if (!localItem) {
                    this.localStorage.setItem(item.id, this.stringify(item));
                }
            }
        };
        Cart.prototype.updateLocalStorageItem = function (item) {
            if (this.localStorage) {
                if (item.id) {
                    var localItem = this.parse(this.localStorage.getItem(item.id));
                    if (localItem) {
                        this.localStorage.setItem(item.id, this.stringify(item));
                    }
                }
                else if (item.totalPrice) {
                    this.localStorage.setItem('totalPrice', item.totalPrice);
                }
            }
        };
        Cart.prototype.deleteLocalStorageItem = function (item) {
            if (this.localStorage) {
                this.localStorage.clear(item.id);
            }
        };
        Cart.$inject = ['$rootScope'];
        return Cart;
    })();
    angular.module('ShoppingCart').service('Cart', Cart);
})(ShoppingCart || (ShoppingCart = {}));

(function (ShoppingCart) {
    'use strict';
    var MainController = (function () {
        function MainController() {
        }
        return MainController;
    })();
    angular.module('ShoppingCart').controller('MainController', MainController);
})(ShoppingCart || (ShoppingCart = {}));

(function () {
    angular.module('ShoppingCart').config(configFn);
    configFn.$inject = ['$routeProvider', '$locationProvider'];
    function configFn($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
            //templateUrl: cdn.mainUrl + 'Shop/shop.html'
            templateUrl: 'build/Cart/cart.html',
            controller: 'CartController',
            controllerAs: 'cartCtrl'
        })
            .when('/shop', {
            templateUrl: 'build/Shop/shop.html',
            controller: 'ShopController',
            controllerAs: 'shopCtrl'
        })
            .when('/checkout', {
            templateUrl: 'build/Checkout/checkout.html',
            controller: 'CheckoutController',
            controllerAs: 'checkoutCtrl',
            pageClass: 'page-checkout',
            reject: resolveFn
        })
            .otherwise({
            redirectTo: '/'
        });

        resolveFn.$inject = ['Cart'];
        function resolveFn(Cart) {
            if (Cart.totalPrice <= 0) {
                $location.path('/');
            }
        }   
    }
    ;
})();

(function (ShoppingCart) {
    'use strict';
    var DataFeftcher = (function () {
        function DataFeftcher($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        DataFeftcher.prototype.getData = function (url) {
            var _this = this;
            return this.$q(function (resolve, reject) {
                _this.$http.get(url).then(function (response) {
                    resolve(response);
                }, function (reason) {
                    reject(reason);
                });
            });
        };
        DataFeftcher.$inject = ['$http', '$q'];
        return DataFeftcher;
    })();
    angular.module('ShoppingCart').service('DataFeftcher', DataFeftcher);
})(ShoppingCart || (ShoppingCart = {}));

(function (ShoppingCart) {
    'use strict';
    var CartController = (function () {
        function CartController(Cart) {
            this.Cart = Cart;
            this.text = {
                checkout: 'Checkout  ',
                cart: 'Your cart'
            };
            this.cartItems = this.Cart.cartItems;
            this.totalPrice = this.Cart.totalPrice;
        }
        CartController.$inject = ['Cart'];
        return CartController;
    })();
    angular.module('ShoppingCart').controller('CartController', CartController);
})(ShoppingCart || (ShoppingCart = {}));

(function (ShoppingCart) {
    var Quantity = (function () {
        function Quantity(Cart) {
            this.Cart = Cart;
            this.restrict = 'E';
            this.templateUrl = 'build/Quantity/qtt.html';
            this.link = {
                pre: this.preLink
            };
        }
        Quantity.prototype.preLink = function ($scope, $element, $attrs) {
            $scope.changeQuantity = changeQuantity;
            var updateTotal = $attrs.updateTotal;
            var __this = this;
            function changeQuantity(type) {
                switch (type) {
                    case 'minus':
                        --$scope.item.quantity;
                        if ($scope.item.quantity <= 0) {
                            $scope.item.quantity = 1;
                        }
                        else {
                            $scope.item.price = Number($scope.item.price) - Number($scope.item.originalPrice);
                            checkUpdateTotal('minus');
                        }
                        break;
                    case 'plus':
                        ++$scope.item.quantity;
                        $scope.item.price = Number($scope.item.price) + Number($scope.item.originalPrice);
                        checkUpdateTotal('plus');
                        break;
                    default:
                        break;
                }
                function checkUpdateTotal(type) {
                    if (updateTotal) {
                        __this.Cart.updateTotalPrice(type, $scope.item.originalPrice);
                        __this.Cart.updateLocalStorageItem($scope.item);
                    }
                }
            }
        };
        Quantity.$inject = ['Cart'];
        return Quantity;
    })();
    angular.module('ShoppingCart')
        .directive('quantity', function (Cart) {
        return new Quantity(Cart);
    });
})(ShoppingCart || (ShoppingCart = {}));

(function (ShoppingCart) {
    'use strict';
    var CheckoutController = (function () {
        function CheckoutController(Cart, $scope, $location) {
            var _this = this;
            this.Cart = Cart;
            this.$scope = $scope;
            this.$location = $location;
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
            this.$scope.$on('totalPrice::change', function (e, data) {
                _this.totalPrice = Number(data.totalPrice);
            });
            this.initLoader = true;
        }
        CheckoutController.prototype.loaderCallback = function () {
            this.cartItems = [];
            this.$location.path('/');
        };
        CheckoutController.prototype.proceed = function () {
            if (this.userData.email && this.userData.email !== ''
                && this.userData.firstName && this.userData.firstName !== ''
                && this.userData.lastName && this.userData.lastName !== ''
                && this.userData.address && this.userData.address !== ''
                && this.userData.city && this.userData.city !== ''
                && this.userData.country && this.userData.country !== ''
                && this.userData.postalCode && this.userData.postalCode !== 0
                && this.userData.paymentAmount && this.userData.paymentAmount !== 0)
                this.userData.paymentAmount = this.Cart.totalPrice;
            console.log(this.userData);
        };
        CheckoutController.$inject = ['Cart', '$scope', '$location'];
        return CheckoutController;
    })();
    angular.module('ShoppingCart').controller('CheckoutController', CheckoutController);
})(ShoppingCart || (ShoppingCart = {}));

(function (ShoppingCart) {
    var SideBarController = (function () {
        function SideBarController(Cart, $scope) {
            this.Cart = Cart;
            this.$scope = $scope;
        }
        SideBarController.prototype.$onInit = function () {
            var _this = this;
            this.text = {
                bag: 'Your Bag',
                shop: 'Shop',
                checkout: 'Checkout'
            };
            this.bagItems = this.Cart.cartItems;
            this.totalPrice = Number(this.Cart.totalPrice);
            this.$scope.$on('totalPrice::change', function (e, data) {
                _this.totalPrice = Number(data.totalPrice);
            });
        };
        SideBarController.prototype.removeFromCart = function (index) {
            this.Cart.removeFromCart(index);
        };
        SideBarController.$inject = ['Cart', '$scope'];
        return SideBarController;
    })();
    var Sidebar = (function () {
        function Sidebar() {
            this.restrict = 'E';
            this.templateUrl = 'build/Sidebar/sidebar.html';
            this.controller = SideBarController;
            this.controllerAs = '$ctrl';
        }
        return Sidebar;
    })();
    angular.module('ShoppingCart')
        .directive('sidebar', function () {
        return new Sidebar();
    });
})(ShoppingCart || (ShoppingCart = {}));

(function (ShoppingCart) {
    var ShopComponentController = (function () {
        function ShopComponentController(DataFeftcher, Cart) {
            this.DataFeftcher = DataFeftcher;
            this.Cart = Cart;
        }
        ShopComponentController.prototype.$onInit = function () {
            var _this = this;
            this.text = {
                button: 'ADD TO CART!'
            };
            this.doneFetching = false;
            this.DataFeftcher.getData('build/Shop/shop.json').then(function (data) {
                _this.data = data.data;
                _this.doneFetching = true;
            }, function (reason) {
                _this.error = reason;
            });
        };
        ShopComponentController.prototype.addToCart = function (index) {
            var data = angular.copy(this.data);
            this.Cart.addToCart(data[index], index);
        };
        ShopComponentController.$inject = ['DataFeftcher', 'Cart'];
        return ShopComponentController;
    })();
    var ShopComponent = (function () {
        function ShopComponent() {
            this.templateUrl = 'build/Shop/shop-component.html';
            this.controller = ShopComponentController;
        }
        return ShopComponent;
    })();
    angular.module('ShoppingCart').component('shop', new ShopComponent());
})(ShoppingCart || (ShoppingCart = {}));

(function (ShoppingCart) {
    'use strict';
    var ShopController = (function () {
        function ShopController() {
            this.text = {
                shop: 'Shopping list'
            };
        }
        return ShopController;
    })();
    angular.module('ShoppingCart').controller('ShopController', ShopController);
})(ShoppingCart || (ShoppingCart = {}));

'use strict';
angular.module('ShoppingCart').directive('ytbCircularLoader', ['$timeout', '$filter', function ($timeout, $filter) {
        var ddo = {
            restrict: 'EA',
            replace: true,
            scope: {
                callback: '&',
                onytbcancel: '&',
                onytbstart: '&',
                init: '=init'
            },
            link: {
                pre: preLinkFn
            },
            templateUrl: 'build/loader/loader.html'
        };
        function preLinkFn($scope, element, attrs) {
            $scope.cancelYtbLoader = cancelYtbLoader;
            $scope.ytbLoaderMoveNext = ytbLoaderMoveNext;
            $scope.cancel = 'Cancel';
            var ytbCircularLoader, ytbLoaderInterval, ytbLoaderTimeout;
            /*
             * Limit is used as the double of the negative defaultValue because the loading is clockwise.
             * Limit can be set to zero if the loading is anti-clockwise
             */
            var limit = -Number(attrs.defaultValue) * 2;
            if ($scope.init === true) {
                if ($scope.onytbstart && typeof $scope.onytbstart === 'function') {
                    $scope.onytbstart();
                }
                ytbCircularLoader = document.getElementById('CircularLoader');
                ytbLoaderInterval = setInterval(function () {
                    increaseYtbLoader();
                }, 5000);
                function increaseYtbLoader() {
                    var current = Number(ytbCircularLoader.getAttribute('stroke-dashoffset'));
                    if (current === limit) {
                        clearInterval(ytbLoaderInterval);
                        var timer = $timeout(function () {
                            if ($scope.callback && typeof $scope.callback === 'function') {
                                $scope.callback();
                            }
                            $timeout.cancel(timer);
                        }, 500, false);
                    }
                    else {
                        ytbCircularLoader.setAttribute('stroke-dashoffset', Number(current - 2));
                    }
                }
            }
            function ytbLoaderMoveNext(e) {
                if (e) {
                    e.stopPropagation();
                }
                cancelYtbLoader();
            }
            function cancelYtbLoader(e) {
                if (e) {
                    e.stopPropagation();
                }
                clearInterval(ytbLoaderInterval);
                $scope.ytbCircularLoader = false;
                if ($scope.onytbcancel && typeof $scope.onytbcancel === 'function') {
                    $scope.onytbcancel();
                }
                if (!e) {
                    if ($scope.callback && typeof $scope.callback === 'function') {
                        $scope.callback();
                    }
                }
            }
        }
        return ddo;
    }]);
