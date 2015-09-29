module app {
	export class Query {
		private criterias : Array<any> = [];
		private sorts : string = null;
		private skips : number = null;
		private limits : number = null;
		private populates : Array<string> = [];
		
		populate(relations : Array<string>) {
			 this.populates = relations; 
		}
		
		equals(property : string, value : any) {
			this.criterias.push({property : property, operator : "", value : value});
			return this;
		}
		
		notEquals(property : string, value : any) {
			this.criterias.push({property : property, operator : "!=", value : value});
			return this;
		}
		
		contains(property : string, value : string) {
			this.criterias.push({property : property, operator : "~", value : value});
			return this;
		}
		
		//Less than equal to
		lte(property : string, value : any) {
			this.criterias.push({property : property, operator : "<=", value : value});
			return this;
		}
		//Less than
		lt(property : string, value : any) {
			this.criterias.push({property : property, operator : "<", value : value});
			return this;
		}
		gte(property : string, value : any) {
			this.criterias.push({property : property, operator : ">=", value : value});
			return this;
		}
		gt(property : string, value : any) {
			this.criterias.push({property : property, operator : ">", value : value});
			return this;
		}
		
		sort(property : string, direction : boolean) {			
			this.sorts = (direction) ? property : '-' + property;
			return this;
		}
		skip(skip : number) {
			this.skips = skip;
			return this;			
		}
		limit(limit : number) {
			this.limits = limit;
			return this;			
		}
		
		toFilter() {
			var filter : any = {};
			this.criterias.forEach((crit) => {
				filter[crit.property] = crit.operator + crit.value;
			})
			var relations = ""
			this.populates.forEach((relation) => {
				relations += "," + relation
			})
			relations = relations.replace(/(^,)|(,$)/g, "")
			if(relations.length > 0)
				filter.populate = relations;				
			if(this.skips != null) {}
				filter.skip = this.skips;			
			if(this.limits != null)
				filter.limit = this.limits;
			if(this.sorts != null)
				filter.sort = this.sorts;
			return filter;
		} 
	}
}