module app {
	export class ProductService extends DataService {
		
		protected resource : string = "products";
		
		//Why is constrcutor needed ?
		constructor(protected Restangular : restangular.IService) {
			super(Restangular);
		}
	}
	angular.module('app').service('ProductService',ProductService);
}