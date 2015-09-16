
module app {
    /**
     * Executes in the configurations phase of the angular application
     */
    export class AppConfigs {

        /*@ngInject*/
        constructor(
            $provide : ng.auto.IProvideService,
            $translateProvider : ng.translate.ITranslateProvider,
            $locationProvider : ng.ILocationProvider
            ) {

            //Set html5 mode
            $locationProvider.html5Mode({
                enabled : true,
                requireBase: false
            }).hashPrefix('!')

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
            $provide.decorator('$exceptionHandler', ($delegate : any, $log : ng.ILogService) => {
                return (exception: Error, cause?: string, source? : string) => {
                    $delegate(exception, cause);
                    $log.error(exception.message, { exception: exception, cause: cause }, source, 'error');
                }
            })
        }
    }
}