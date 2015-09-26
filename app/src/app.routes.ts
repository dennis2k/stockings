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
                controllerAs : 'vm'
            })
            
  	  } 
	}
}