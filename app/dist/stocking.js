var app;
(function (app) {
    var DataService = (function () {
        function DataService(Restangular) {
            this.Restangular = Restangular;
        }
        DataService.prototype.save = function (entity) {
            if (entity._id)
                this.Restangular.one(this.resource, entity._id).customPUT(entity);
            else
                this.Restangular.one(this.resource).customPOST(entity);
        };
        DataService.prototype.findAll = function () {
            return this.Restangular.all(this.resource).getList();
        };
        DataService.prototype.findById = function (id, query) {
            console.log("QUERY", query);
            if (query) {
                console.log(query.toFilter());
                return this.Restangular.one(this.resource, id).get(query.toFilter());
            }
            else
                return this.Restangular.one(this.resource, id).get();
        };
        DataService.prototype.findByQuery = function (query) {
            return this.Restangular.all(this.resource).getList(query.toFilter());
        };
        DataService.prototype.delete = function (entity) {
            return this.Restangular.one(this.resource, entity._id).remove();
        };
        return DataService;
    })();
    app.DataService = DataService;
})(app || (app = {}));

var app;
(function (app) {
    /**
     * Executes in the configurations phase of the angular application
     */
    var AppConfigs = (function () {
        /*@ngInject*/
        function AppConfigs($provide, $translateProvider, $locationProvider, RestangularProvider, $base64) {
            //Configure restangular with base url
            RestangularProvider.setBaseUrl('http://localhost/api/v1/');
            //Set html5 mode
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            }).hashPrefix('!');
            //Exception handling
            $provide.decorator('$exceptionHandler', ["$delegate", "$log", function ($delegate, $log) {
                return function (exception, cause, source) {
                    $delegate(exception, cause);
                    $log.error(exception.message, { exception: exception, cause: cause }, source, 'error');
                };
            }]);
        }
        AppConfigs.$inject = ["$provide", "$translateProvider", "$locationProvider", "RestangularProvider", "$base64"];
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
                $state.go('login');
            });
            $stateProvider
                .state('login', {
                url: '/',
                templateUrl: 'src/modules/authenticate/login.html',
                controller: app.AuthController,
                controllerAs: 'vm'
            })
                .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'src/templates/app.html'
            })
                .state('app.products', {
                url: '/products',
                templateUrl: 'src/modules/products/product-list.html',
                controller: 'ProductListController',
                controllerAs: 'vm',
                resolve: {
                    products: function (ProductService) {
                        var query = new app.Query();
                        query.populate(['stockings.stock_location_id']);
                        return ProductService.findByQuery(query);
                    },
                    stock_locations: function (StockLocationService) {
                        return StockLocationService.findAll();
                    }
                }
            })
                .state('app.product', {
                url: '/products/:id',
                templateUrl: 'src/modules/products/product.html',
                controller: 'ProductController',
                controllerAs: 'vm',
                resolve: {
                    product: function (ProductService, $stateParams) {
                        if (AppRoutes.hasId($stateParams)) {
                            var query = new app.Query();
                            query.populate(['stockings.stock_location_id']);
                            return ProductService.findById($stateParams['id'], query);
                        }
                        return null;
                    }
                }
            })
                .state('app.stocklocations', {
                url: '/stocklocations',
                templateUrl: 'src/modules/stocks/stocklocation-list.html',
                controller: 'StockLocationListController',
                controllerAs: 'vm',
                resolve: {
                    stock_locations: function (StockLocationService) {
                        return StockLocationService.findAll();
                    }
                }
            })
                .state('app.stocklocation', {
                url: '/stocklocations/:id',
                templateUrl: 'src/modules/stocks/stocklocation.html',
                controller: 'StockLocationController',
                controllerAs: 'vm',
                resolve: {
                    stock_location: function (StockLocationService, $stateParams) {
                        if (AppRoutes.hasId($stateParams)) {
                            return StockLocationService.findById($stateParams['id']);
                        }
                        return null;
                    }
                }
            });
        }
        AppRoutes.hasId = function ($stateParams) {
            if ($stateParams['id'] && $stateParams['id'] != '')
                return true;
            return false;
        };
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
        function AppRun($rootScope, toaster, $state, $location, localStorageService, Restangular) {
            $rootScope.bootstrapped = false;
            $rootScope.authorized = false;
            $rootScope.blockui = false;
            $rootScope.init_path = $location.path();
            //Handle toast on response
            Restangular.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                if (operation == 'remove')
                    toaster.success('Success!', 'Entity deleted!');
                if (operation == 'put')
                    toaster.success('Success!', 'Entity updated!');
                if (operation == 'post')
                    toaster.success('Success!', 'Entity created!');
                console.log(operation);
                console.log(response.status);
                console.log("Interfacepting data response");
                return data;
            });
            //Catch API erorrs
            Restangular.setErrorInterceptor(function (response) {
                if (response.status == 401 || response.status == 403) {
                    localStorageService.clearAll();
                    $state.go('login');
                }
                else if (response.status == 404) {
                    console.error("Resource not available...");
                }
                else if (response.status == 400 || response.status == 500) {
                    console.error("Error response from server");
                }
                return false; // stop the promise chain
            });
            //Set token if it is localstorage
            var token = localStorageService.get('token');
            if (token) {
                Restangular.setDefaultHeaders({ 'x-access-token': token });
            }
            /**
             * Handles when we get authorized
             * Note that this does not mean we are done bootstrapping the application
             */
            $rootScope.$on('authorized', function (event, data) {
                $rootScope.authorized = true;
                $rootScope.user = localStorageService.get('user');
                $state.go('app.products');
            });
            /**
             * Handles unauthorized sessions
             */
            $rootScope.$on('unauthorized', function (event, data) {
                $rootScope.bootstrapped = true;
                $rootScope.authorized = false;
                $rootScope.blockui = false;
                $state.go('login');
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
            $state.go('login');
        }
        AppRun.$inject = ["$rootScope", "toaster", "$state", "$location", "localStorageService", "Restangular"];
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
        'restangular',
        'LocalStorageModule',
        'base64',
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
    var AuthController = (function () {
        function AuthController(AuthService) {
            this.AuthService = AuthService;
        }
        AuthController.$inject = ["AuthService"];
        AuthController.prototype.login = function (email, password) {
            console.log("LOGGIN ING ");
            this.AuthService.authenticate(email, password);
        };
        return AuthController;
    })();
    app.AuthController = AuthController;
    angular.module('app').controller('AuthController', AuthController);
})(app || (app = {}));

var app;
(function (app) {
    var AuthService = (function () {
        function AuthService($http, $rootScope, localStorageService, Restangular) {
            this.$http = $http;
            this.$rootScope = $rootScope;
            this.localStorageService = localStorageService;
            this.Restangular = Restangular;
        }
        AuthService.$inject = ["$http", "$rootScope", "localStorageService", "Restangular"];
        AuthService.prototype.authenticate = function (email, password) {
            var _this = this;
            this.$http.post('http://localhost/authenticate', { email: email, password: password }).then(function (response) {
                if (response.status == 401)
                    _this.$rootScope.$broadcast('unauthorized');
                if (response.status == 200) {
                    _this.localStorageService.set('token', response.data.token);
                    _this.Restangular.setDefaultHeaders({ 'x-access-token': response.data.token });
                    _this.$rootScope.$broadcast('authorized');
                }
            });
        };
        return AuthService;
    })();
    app.AuthService = AuthService;
    angular.module('app').service('AuthService', AuthService);
})(app || (app = {}));

var app;
(function (app) {
    var ProductListController = (function () {
        function ProductListController(ProductService, products, stock_locations, $filter) {
            this.ProductService = ProductService;
            this.products = products;
            this.stock_locations = stock_locations;
            this.$filter = $filter;
            this.productsToAdjust = [];
        }
        ProductListController.$inject = ["ProductService", "products", "stock_locations", "$filter"];
        ProductListController.prototype.getCurrentStock = function (product, stock) {
            for (var index = 0; index < product.stockings.length; index++) {
                var element = product.stockings[index];
                if (stock._id == element.stock_location_id._id)
                    return element.current_stock;
            }
        };
        ProductListController.prototype.isProductAdjustable = function (product) {
            var products = this.$filter('filter')(this.productsToAdjust, { _id: product._id });
            if (products.length > 0)
                return false;
            return true;
        };
        ProductListController.prototype.addProductForAdjustment = function (product) {
            this.productsToAdjust.push(angular.copy(product));
            console.log(this.productsToAdjust);
        };
        ProductListController.prototype.remove = function (product) {
            var _this = this;
            this.ProductService.delete(product).then(function (response) {
                _this.products.splice(_this.products.indexOf(product), 1);
            });
        };
        return ProductListController;
    })();
    app.ProductListController = ProductListController;
    angular.module('app').controller('ProductListController', ProductListController);
})(app || (app = {}));

var app;
(function (app) {
    var ProductController = (function () {
        function ProductController(ProductService, $state, product, Restangular) {
            this.ProductService = ProductService;
            this.$state = $state;
            this.product = product;
            this.Restangular = Restangular;
            console.log(product);
        }
        ProductController.$inject = ["ProductService", "$state", "product", "Restangular"];
        ProductController.prototype.save = function (product) {
            this.ProductService.save(product);
        };
        ProductController.prototype.remove = function (product) {
            var _this = this;
            this.ProductService.delete(product).then(function (response) {
                _this.$state.go('app.products');
            });
        };
        return ProductController;
    })();
    app.ProductController = ProductController;
    angular.module('app').controller('ProductController', ProductController);
})(app || (app = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var app;
(function (app) {
    var ProductService = (function (_super) {
        __extends(ProductService, _super);
        //Why is constrcutor needed ?
        function ProductService(Restangular) {
            _super.call(this, Restangular);
            this.Restangular = Restangular;
            this.resource = "products";
        }
        ProductService.$inject = ["Restangular"];
        return ProductService;
    })(app.DataService);
    app.ProductService = ProductService;
    angular.module('app').service('ProductService', ProductService);
})(app || (app = {}));

var app;
(function (app) {
    var StockLocationListController = (function () {
        function StockLocationListController(StockLocationService, stock_locations) {
            this.StockLocationService = StockLocationService;
            this.stock_locations = stock_locations;
        }
        StockLocationListController.$inject = ["StockLocationService", "stock_locations"];
        StockLocationListController.prototype.remove = function (stock) {
            var _this = this;
            this.StockLocationService.delete(stock).then(function (response) {
                _this.stock_locations.splice(_this.stock_locations.indexOf(stock), 1);
            });
        };
        return StockLocationListController;
    })();
    app.StockLocationListController = StockLocationListController;
    angular.module('app').controller('StockLocationListController', StockLocationListController);
})(app || (app = {}));

var app;
(function (app) {
    var StockLocationController = (function () {
        function StockLocationController(StockLocationService, $state, stock_location) {
            this.StockLocationService = StockLocationService;
            this.$state = $state;
            this.stock_location = stock_location;
        }
        StockLocationController.$inject = ["StockLocationService", "$state", "stock_location"];
        StockLocationController.prototype.save = function (stock) {
            this.StockLocationService.save(stock);
        };
        StockLocationController.prototype.remove = function (stock) {
            var _this = this;
            this.StockLocationService.delete(stock).then(function (response) {
                _this.$state.go('app.stocks');
            });
        };
        return StockLocationController;
    })();
    app.StockLocationController = StockLocationController;
    angular.module('app').controller('StockLocationController', StockLocationController);
})(app || (app = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var app;
(function (app) {
    var StockLocationService = (function (_super) {
        __extends(StockLocationService, _super);
        //Why is constrcutor needed ?
        function StockLocationService(Restangular) {
            _super.call(this, Restangular);
            this.Restangular = Restangular;
            this.resource = "stocklocations";
        }
        StockLocationService.$inject = ["Restangular"];
        return StockLocationService;
    })(app.DataService);
    app.StockLocationService = StockLocationService;
    angular.module('app').service('StockLocationService', StockLocationService);
})(app || (app = {}));

var app;
(function (app) {
    var Query = (function () {
        function Query() {
            this.criterias = [];
            this.sorts = null;
            this.skips = null;
            this.limits = null;
            this.populates = [];
        }
        Query.prototype.populate = function (relations) {
            this.populates = relations;
        };
        Query.prototype.equals = function (property, value) {
            this.criterias.push({ property: property, operator: "", value: value });
            return this;
        };
        Query.prototype.notEquals = function (property, value) {
            this.criterias.push({ property: property, operator: "!=", value: value });
            return this;
        };
        Query.prototype.contains = function (property, value) {
            this.criterias.push({ property: property, operator: "~", value: value });
            return this;
        };
        //Less than equal to
        Query.prototype.lte = function (property, value) {
            this.criterias.push({ property: property, operator: "<=", value: value });
            return this;
        };
        //Less than
        Query.prototype.lt = function (property, value) {
            this.criterias.push({ property: property, operator: "<", value: value });
            return this;
        };
        Query.prototype.gte = function (property, value) {
            this.criterias.push({ property: property, operator: ">=", value: value });
            return this;
        };
        Query.prototype.gt = function (property, value) {
            this.criterias.push({ property: property, operator: ">", value: value });
            return this;
        };
        Query.prototype.sort = function (property, direction) {
            this.sorts = (direction) ? property : '-' + property;
            return this;
        };
        Query.prototype.skip = function (skip) {
            this.skips = skip;
            return this;
        };
        Query.prototype.limit = function (limit) {
            this.limits = limit;
            return this;
        };
        Query.prototype.toFilter = function () {
            var filter = {};
            this.criterias.forEach(function (crit) {
                filter[crit.property] = crit.operator + crit.value;
            });
            var relations = "";
            this.populates.forEach(function (relation) {
                relations += "," + relation;
            });
            relations = relations.replace(/(^,)|(,$)/g, "");
            if (relations.length > 0)
                filter.populate = relations;
            if (this.skips != null) { }
            filter.skip = this.skips;
            if (this.limits != null)
                filter.limit = this.limits;
            if (this.sorts != null)
                filter.sort = this.sorts;
            return filter;
        };
        return Query;
    })();
    app.Query = Query;
})(app || (app = {}));
