module app {
	export class DataService {
		
		protected resource;
		
		constructor(protected Restangular : restangular.IService) {
		}
		
		save(entity : any) {
			return this.Restangular.all(this.resource).save(entity);
		}
		
		findAll() : restangular.ICollectionPromise<any> {	
			return this.Restangular.all(this.resource).getList();
		}
		
		findById(id) {
			return this.Restangular.one(this.resource, id).get();
		}
		
		findByQuery(query : Query) {
			return this.Restangular.all(this.resource).getList(query.toFilter());
		}
	}
}