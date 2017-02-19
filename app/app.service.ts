/// <reference path="./../tools/typings/angularjs/angular.d.ts" />

module ShoppingCart {

	'use strict';

	class DataFeftcher {
		
		static $inject = ['$http', '$q'];

		constructor(private $http: ng.IHttpService, private $q: any) {}

		getData(url): ng.IPromise<any> {
			return this.$q((resolve, reject) => {
				this.$http.get(url).then(
					(response: any) => {
						resolve(response)
					},
					(reason: any) => {
						reject(reason);
					}
				);
			});
		}
	}
	angular.module('ShoppingCart').service('DataFeftcher', DataFeftcher);
}