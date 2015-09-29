module app {
	export class StockLocationService extends DataService {
		
		protected resource : string = "stocklocations";
		
		//Why is constrcutor needed ?
		constructor(protected Restangular : restangular.IService) {
			super(Restangular);
		}
	}
	angular.module('app').service('StockLocationService',StockLocationService);
} 