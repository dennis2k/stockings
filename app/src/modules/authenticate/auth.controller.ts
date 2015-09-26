module app {
	export class AuthController {
		constructor(private AuthService : AuthService) {
			
		}
		
		login(email : string, password : string) {
			console.log("LOGGIN ING ")
			this.AuthService.authenticate(email,password);
		}
	}
	angular.module('app').controller('AuthController',AuthController);
} 