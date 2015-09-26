module app {
	export class ProductListController {
		
		private products = [];
		
		constructor(ProductService : ProductService) {
			
			var q = new Query();
			q.contains('name', 'MAA');
			ProductService.findByQuery(q).then((response) => {
				this.products = response;
				console.log(this.products);
			})
		}
	}
	
	angular.module('app').controller('ProductListController',ProductListController);
}