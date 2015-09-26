
module app {
    /**
     * Executes in the configurations phase of the angular application
     */
    export class AppConfigs {

        /*@ngInject*/
        constructor(
            $provide : ng.auto.IProvideService,
            $translateProvider : ng.translate.ITranslateProvider,
            $locationProvider : ng.ILocationProvider,
            RestangularProvider : restangular.IProvider,
            $base64 : any            
            ) {
            
            //Configure restangular with base url
            RestangularProvider.setBaseUrl('http://localhost/api/v1/');                

            //Set html5 mode
            $locationProvider.html5Mode({
                enabled : true,
                requireBase: false
            }).hashPrefix('!')

            //Exception handling
            $provide.decorator('$exceptionHandler', ($delegate : any, $log : ng.ILogService) => {
                return (exception: Error, cause?: string, source? : string) => {
                    $delegate(exception, cause);
                    $log.error(exception.message, { exception: exception, cause: cause }, source, 'error');
                }
            })
        }
    }
}