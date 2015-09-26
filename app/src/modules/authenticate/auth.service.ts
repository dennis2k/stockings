module app {
	export class AuthService {
		
		constructor(
			private $http : ng.IHttpService,
			private $rootScope : ng.IRootScopeService,
			private localStorageService : angular.local.storage.ILocalStorageService,
			private Restangular : restangular.IService) {
			
		}
		
		authenticate(email : string, password : string) {
			this.$http.post('http://localhost/authenticate',{ email : email, password : password}).then((response : any) => {
				if(response.status == 401)
					this.$rootScope.$broadcast('unauthorized');
				if(response.status == 200) {
					this.localStorageService.set('token',response.data.token);
					this.Restangular.setDefaultHeaders({'x-access-token' : response.data.token})
					this.$rootScope.$broadcast('authorized');
				}
			})
		}
	}
	angular.module('app').service('AuthService',AuthService);
}