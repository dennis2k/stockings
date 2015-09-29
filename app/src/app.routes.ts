module app {
    export class AppRoutes {
        
        constructor(
            private $stateProvider : ng.ui.IStateProvider,
            private $urlRouterProvider : ng.ui.IUrlRouterProvider 
            )
        {
            $urlRouterProvider.otherwise( ($injector : ng.auto.IInjectorService) => {
                    var $state : any = $injector.get('$state');
                    $state.go('login');
                }
            );
            $stateProvider
            
            .state('login', {
                url: '/',                
                templateUrl : 'src/modules/authenticate/login.html',
                controller : AuthController,
                controllerAs : 'vm'
                
            })
            
            .state('app', {
                abstract : true, 
                url: '/app',                
                templateUrl : 'src/templates/app.html'
            })
            .state('app.products', {
                url: '/products',
                templateUrl : 'src/modules/products/product-list.html',                                
                controller: 'ProductListController',
                controllerAs : 'vm',
                resolve : {
                    products : (ProductService : ProductService) => {
                        var query = new Query();
                        query.populate(['stockings.stock_location_id'])
                        return ProductService.findByQuery(query);
                    },
                    stock_locations : (StockLocationService : StockLocationService) => {                        
                        return StockLocationService.findAll();
                    }
                }
            })
            .state('app.product', {
                url: '/products/:id',
                templateUrl : 'src/modules/products/product.html',                                
                controller: 'ProductController',
                controllerAs : 'vm',
                resolve : {
                    product : (ProductService : ProductService,$stateParams : ng.ui.IStateParamsService) => {
                        if(AppRoutes.hasId($stateParams)) {
                            var query = new Query();
                            query.populate(['stockings.stock_location_id'])
                            return ProductService.findById($stateParams['id'],query);
                            
                        }                            
                        return null;
                    }
                }
            })
            .state('app.stocklocations', {
                url: '/stocklocations',
                templateUrl : 'src/modules/stocks/stocklocation-list.html',                                
                controller: 'StockLocationListController',
                controllerAs : 'vm',
                resolve : {
                    stock_locations : (StockLocationService : StockLocationService) => {                        
                        return StockLocationService.findAll();
                    }
                }
            })
            .state('app.stocklocation', {
                url: '/stocklocations/:id',
                templateUrl : 'src/modules/stocks/stocklocation.html',                                
                controller: 'StockLocationController',
                controllerAs : 'vm',
                resolve : {
                    stock_location : (StockLocationService : StockLocationService,$stateParams : ng.ui.IStateParamsService) => {
                        if(AppRoutes.hasId($stateParams)) {
                            return StockLocationService.findById($stateParams['id']);
                        }
                            
                        return null;
                    }
                }
            })       
  	     } 
        
        static hasId($stateParams) {
            if($stateParams['id'] && $stateParams['id'] != '')
                return true;
            return false;
        }
	}
    
    
}