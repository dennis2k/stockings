module app {
	export class StockLocationController {

		constructor(
			private StockLocationService : StockLocationService,
			private $state : ng.ui.IStateService,
			private stock_location : any) {						
		}
		
		save(stock) {
			this.StockLocationService.save(stock)
		}
		
		remove(stock) {
			this.StockLocationService.delete(stock).then((response) => {
				this.$state.go('app.stocks')
			});
		}
	}
	
	angular.module('app').controller('StockLocationController',StockLocationController);
} 