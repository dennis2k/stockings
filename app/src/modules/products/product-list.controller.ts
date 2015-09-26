module app {
	export class ProductListController {
		
		constructor(
			private ProductService : ProductService,
			private products : Array<any>
			) {			
			
		}
		
		remove(product) {
			this.ProductService.delete(product).then((response) => {
				this.products.splice(this.products.indexOf(product),1);
			});
		}
	}
	
	angular.module('app').controller('ProductListController',ProductListController);
}