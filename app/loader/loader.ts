'use strict';

angular.module('ShoppingCart').directive('ytbCircularLoader', ['$timeout', '$filter', function($timeout, $filter) {

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
        templateUrl: '/development/loader/loader.html'
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

            ytbLoaderInterval = setInterval(function() {
                increaseYtbLoader();
            }, 5000);

            function increaseYtbLoader() {
                var current = Number(ytbCircularLoader.getAttribute('stroke-dashoffset'));
                if (current === limit) {
                    clearInterval(ytbLoaderInterval);
                    var timer = $timeout(function() {
                        if ($scope.callback && typeof $scope.callback === 'function') {
                            $scope.callback();
                        }
                        $timeout.cancel(timer);
                    }, 500, false);
                } else {
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