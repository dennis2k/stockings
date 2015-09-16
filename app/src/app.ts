module app {
	angular.module('app',[
		'ngAnimate',
		'ngCookies',
		'pascalprecht.translate',
		'ngSanitize',
		'ngResource',
		'toaster',
		'ui.router',
		'ui.bootstrap',
		'LocalStorageModule',
		'app.views' 
		])
		.config(AppRoutes)
		.config(AppConfigs)
		.run(AppRun)
		.controller('AppController',AppController)

	    //Bootstrap the application manually
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
} 