var app;
(function (app) {
    /**
     * Executes in the configurations phase of the angular application
     */
    var AppConfigs = (function () {
        /*@ngInject*/
        function AppConfigs($provide, $translateProvider, $locationProvider) {
            //Set html5 mode
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            }).hashPrefix('!');
            //Language config
            /*$translateProvider
                .useStaticFilesLoader({
                prefix: '/assets/i18n/',
                suffix: '.json'
                })
                .preferredLanguage('en')
                .fallbackLanguage('en')
                .useSanitizeValueStrategy('sanitize')
                .useLocalStorage();

            // TODO: Add DEBUG condition check
            // Comment this when not getting keys
            $translateProvider.useMissingTranslationHandler("outputMissingKeysHandler");
            */
            //Exception handling
            $provide.decorator('$exceptionHandler', ["$delegate", "$log", function ($delegate, $log) {
                return function (exception, cause, source) {
                    $delegate(exception, cause);
                    $log.error(exception.message, { exception: exception, cause: cause }, source, 'error');
                };
            }]);
        }
        AppConfigs.$inject = ["$provide", "$translateProvider", "$locationProvider"];
        return AppConfigs;
    })();
    app.AppConfigs = AppConfigs;
})(app || (app = {}));

var app;
(function (app) {
    var AppController = (function () {
        function AppController() {
        }
        AppController.prototype.toggleMenu = function () {
            console.log("TOGGLE");
            $("#wrapper").toggleClass("toggled");
        };
        return AppController;
    })();
    app.AppController = AppController;
})(app || (app = {}));

var app;
(function (app) {
    var AppRoutes = (function () {
        function AppRoutes($stateProvider, $urlRouterProvider) {
            this.$stateProvider = $stateProvider;
            this.$urlRouterProvider = $urlRouterProvider;
            $urlRouterProvider.otherwise(function ($injector) {
                var $state = $injector.get('$state');
                $state.go('pages.login');
            });
            $stateProvider
                .state('app', {
                abstract: true,
                url: '/app',
                resolve: {
                    myEntity: function () {
                        return "hello";
                    }
                }
            })
                .state('products', {
                abstract: true,
                url: '/products',
                templateUrl: 'src/modules/products/product-list.html',
                controller: 'AppController',
                resolve: {
                    myEntity: function () {
                        return "hello";
                    }
                }
            });
        }
        return AppRoutes;
    })();
    app.AppRoutes = AppRoutes;
})(app || (app = {}));

var app;
(function (app) {
    /**
     * Executes in the runs phase of the angular application
     */
    var AppRun = (function () {
        /*@ngInject*/
        function AppRun($rootScope, toaster, $state, $location, localStorageService) {
            $rootScope.bootstrapped = false;
            $rootScope.authorized = false;
            $rootScope.blockui = false;
            $rootScope.init_path = $location.path();
            /**
             * Handles when we get authorized
             * Note that this does not mean we are done bootstrapping the application
             */
            $rootScope.$on('authorized', function (event, data) {
                $rootScope.authorized = true;
                $rootScope.user = localStorageService.get('user');
            });
            /**
             * Handles unauthorized sessions
             */
            $rootScope.$on('unauthorized', function (event, data) {
                toaster.error("Invalid credentials", "Wrong username or password");
                $rootScope.init_path == "/pages/login";
                $rootScope.bootstrapped = true;
                $rootScope.authorized = false;
                $rootScope.blockui = false;
                $state.go('pages.logout');
            });
            /**
             * Handles when the masteruser data is received from the backend
             */
            $rootScope.$on('configured', function (event, data) {
                $rootScope.theme_path = data;
                if ($rootScope.init_path == "/pages/login" || $rootScope.init_path == "" || $rootScope.init_path == "/") {
                    $state.go("app.products", { id: '' });
                }
                else {
                    $location.path($rootScope.init_path);
                }
                $rootScope.bootstrapped = true;
                $rootScope.blockui = false;
            });
            /**
             * Prevent unauthorized users from changing state
             */
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            });
            /**
             * Components are able to block UI by broadcasting the 'blockui' message
             */
            $rootScope.$on('blockui', function () {
                $rootScope.blockui = true;
            });
            /**
             * Components are able to unblock UI by broadcasting the 'blockui' message
             */
            $rootScope.$on('unblockui', function () {
                $rootScope.blockui = false;
            });
            /**
             * BlockUI when changing state
             */
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $rootScope.blockui = true;
            });
            /**
             * unblock UI when changing state is done
             */
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $rootScope.blockui = false;
            });
            /**
             * unblock UI when state is not found
             */
            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                //@ToasterService.warning("Route not found");
                $rootScope.blockui = false;
            });
            /**
             * unblock UI when state error occurs
             */
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                //@ToasterService.warning("Route error")
                $rootScope.blockui = false;
            });
        }
        AppRun.$inject = ["$rootScope", "toaster", "$state", "$location", "localStorageService"];
        return AppRun;
    })();
    app.AppRun = AppRun;
})(app || (app = {}));

var app;
(function (app) {
    angular.module('app', [
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
        .config(app.AppRoutes)
        .config(app.AppConfigs)
        .run(app.AppRun)
        .controller('AppController', app.AppController);
    //Bootstrap the application manually
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });
})(app || (app = {}));

var app;
(function (app) {
    var ProductControllerList = (function () {
        function ProductControllerList() {
            console.log("Hello controller");
        }
        return ProductControllerList;
    })();
    app.ProductControllerList = ProductControllerList;
    angular.module('app').controller('ProductControllerList', ProductControllerList);
})(app || (app = {}));
