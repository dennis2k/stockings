module app {
	export class AppController {
		toggleMenu() {
			console.log("TOGGLE");
			$("#wrapper").toggleClass("toggled");
		}
	}		
}