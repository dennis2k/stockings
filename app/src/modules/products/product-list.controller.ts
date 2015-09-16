module app {
	export class ProductControllerList {
		constructor() {
			console.log("Hello controller")
		}
	}
	
	angular.module('app').controller('ProductControllerList',ProductControllerList);
}