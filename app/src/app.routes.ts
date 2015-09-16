module app {
    export class AppRoutes {
        
        constructor(
            private $stateProvider : ng.ui.IStateProvider,
            private $urlRouterProvider : ng.ui.IUrlRouterProvider 
            )
        {
            $urlRouterProvider.otherwise( ($injector : ng.auto.IInjectorService) => {
                    var $state = $injector.get('$state');
                    $state.go('pages.login');
                }
            );
            $stateProvider
            
            .state('app', {
                abstract: true,
                url: '/app',                
                resolve: {
					myEntity : () => {
						return "hello"
					}
                }
            })
            .state('products', {
                abstract: true,
                url: '/products',
                templateUrl : 'src/modules/products/product-list.html',                                
                controller: 'AppController',
                resolve: {
					myEntity : () => {
						return "hello"
					}
                }
            })
            
  	  }
	}
}