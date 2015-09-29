module app {
	export class DataService {
		
		protected resource;
		
		constructor(protected Restangular : restangular.IService) {
		}
		
		save(entity : any) {
			if(entity._id) 
				this.Restangular.one(this.resource,entity._id).customPUT(entity);			
			else 
				this.Restangular.one(this.resource).customPOST(entity);	
		}
		
		findAll() : restangular.ICollectionPromise<any> {	
			return this.Restangular.all(this.resource).getList();
		}
		
		findById(id,query? : Query) {
			console.log("QUERY",query)
			if(query) {
				console.log(query.toFilter())
				return this.Restangular.one(this.resource, id).get(query.toFilter());
			}
				
			else
				return this.Restangular.one(this.resource, id).get();
			
		}
		
		findByQuery(query : Query) {
			return this.Restangular.all(this.resource).getList(query.toFilter());
		}
		
		delete(entity) {
			return this.Restangular.one(this.resource,entity._id).remove();
		}
	}
}