module app {	
    /**
     * Executes in the runs phase of the angular application
     */
    export class AppRun {

        /*@ngInject*/
        constructor(
            $rootScope : any,
            toaster : ngtoaster.IToasterService,
            $state : ng.ui.IStateService,
            $location : ng.ILocationService,
            localStorageService : angular.local.storage.ILocalStorageService,
            Restangular : restangular.IService) {

            $rootScope.bootstrapped = false;
            $rootScope.authorized = false;
            $rootScope.blockui = false;
            $rootScope.init_path = $location.path();
            
            //Handle toast on response
            Restangular.addResponseInterceptor((data, operation, what, url, response, deferred) => {
                if(operation == 'remove')
                    toaster.success('Success!','Entity deleted!')
                if(operation == 'put')
                    toaster.success('Success!','Entity updated!')
                if(operation == 'post')
                    toaster.success('Success!','Entity created!')
                console.log(operation);
                console.log(response.status);
                console.log("Interfacepting data response")
                return data;
            });
            
            //Catch API erorrs
             Restangular.setErrorInterceptor(
                (response) => {
                    if (response.status == 401 || response.status == 403) {
                        localStorageService.clearAll();
                        $state.go('login')
                    } else if (response.status == 404) {
                        console.error("Resource not available...");
                    } else if (response.status == 400 || response.status == 500) {
                        console.error("Error response from server");
                    }
                    return false; // stop the promise chain
                }
            );       
                
            //Set token if it is localstorage
            var token = localStorageService.get('token');
            if(token) {
                Restangular.setDefaultHeaders({'x-access-token' : token})
            }

            /**
             * Handles when we get authorized
             * Note that this does not mean we are done bootstrapping the application
             */
            $rootScope.$on('authorized',(event,data) => {
                $rootScope.authorized = true;
                $rootScope.user = localStorageService.get('user');
                $state.go('app.products');
            })
            /**
             * Handles unauthorized sessions
             */
            $rootScope.$on('unauthorized',(event,data) => {                
                $rootScope.bootstrapped = true;
                $rootScope.authorized = false;
                $rootScope.blockui = false;
                $state.go('login');
            })

            /**
             * Handles when the masteruser data is received from the backend
             */
            $rootScope.$on('configured',(event,data) => {
                $rootScope.theme_path = data
                if($rootScope.init_path == "/pages/login" || $rootScope.init_path == "" || $rootScope.init_path == "/"){
                    $state.go("app.products",{id : ''});
                } else {
                    $location.path($rootScope.init_path);
                }
                $rootScope.bootstrapped = true;
                $rootScope.blockui = false;

            })

            /**
             * Prevent unauthorized users from changing state
             */
            $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {

            });

            /**
             * Components are able to block UI by broadcasting the 'blockui' message
             */
            $rootScope.$on('blockui',() => {
                $rootScope.blockui = true
            })
            /**
             * Components are able to unblock UI by broadcasting the 'blockui' message
             */
            $rootScope.$on('unblockui',() => {
                $rootScope.blockui = false;
            })

            /**
             * BlockUI when changing state
             */
            $rootScope.$on('$stateChangeStart',(event, toState, toParams, fromState, fromParams) => {
                $rootScope.blockui = true
            })
            /**
             * unblock UI when changing state is done
             */
            $rootScope.$on('$stateChangeSuccess',(event, toState, toParams, fromState, fromParams) => {
                $rootScope.blockui = false
            })
            /**
             * unblock UI when state is not found
             */
            $rootScope.$on('$stateNotFound', (event, unfoundState, fromState, fromParams) => {
                //@ToasterService.warning("Route not found");
                $rootScope.blockui = false
            })
            /**
             * unblock UI when state error occurs
             */
            $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
                //@ToasterService.warning("Route error")
                $rootScope.blockui = false
            })

            $state.go('login');
        }
    }
}