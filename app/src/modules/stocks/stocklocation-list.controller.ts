module app {
	export class StockLocationListController {
		
		constructor(
			private StockLocationService : StockLocationService,
			private stock_locations : Array<any>
			) {			
			
		}
		
		remove(stock) {
			this.StockLocationService.delete(stock).then((response) => {
				this.stock_locations.splice(this.stock_locations.indexOf(stock),1);
			});
		}
	}
	
	angular.module('app').controller('StockLocationListController',StockLocationListController);
}