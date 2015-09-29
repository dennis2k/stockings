module app {
	export class ProductListController {
		
		private productsToAdjust : Array<any> = [];
		
		constructor(
			private ProductService : ProductService,
			private products : Array<any>,
			private stock_locations : Array<any>,
			private $filter : ng.IFilterService			
			) {			
			
		}
		
		getCurrentStock(product : any,stock : any) {
			for (var index = 0; index < product.stockings.length; index++) {
				var element = product.stockings[index];
				if(stock._id == element.stock_location_id._id)
					return element.current_stock;
				
			}
		}
		
		isProductAdjustable(product : any) {
			var products = this.$filter('filter')(this.productsToAdjust,{_id : product._id});
			if(products.length > 0)
				return false;
			return true;
		}
		addProductForAdjustment(product : any) {
			this.productsToAdjust.push(angular.copy(product));
			
			console.log(this.productsToAdjust)
		}
		
		remove(product) {
			this.ProductService.delete(product).then((response) => {
				this.products.splice(this.products.indexOf(product),1);
			});
		}
	}	
	angular.module('app').controller('ProductListController',ProductListController);
} 