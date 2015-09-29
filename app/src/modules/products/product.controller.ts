module app {
	export class ProductController {

		private selectedStock;

		constructor(
			private ProductService : ProductService,
			private $state : ng.ui.IStateService,
			private product : any,
			protected Restangular : restangular.IService) {						
				console.log(product)
		}
		
		
		save(product) {
			this.ProductService.save(product)
		}
		
		remove(product) {
			this.ProductService.delete(product).then((response) => {
				this.$state.go('app.products')
			});
		} 
	}
	
	angular.module('app').controller('ProductController',ProductController);
}