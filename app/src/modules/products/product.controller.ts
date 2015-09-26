module app {
	export class ProductController {
		
		private products = [];
		
		constructor(
			private ProductService : ProductService,
			private $state : ng.ui.IStateService,
			private product : any) {						
				console.log(product)
		}
		
		save(product) {
			this.ProductService.save(product).then((response) => {
				
			})
		}
		
		remove(product) {
			this.ProductService.delete(product).then((response) => {
				this.$state.go('app.products')
			});
		}
	}
	
	angular.module('app').controller('ProductController',ProductController);
}