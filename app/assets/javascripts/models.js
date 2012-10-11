
Backbone.old_sync = Backbone.sync
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            var token = $('meta[name="csrf-token"]').attr('content');
            if (token) xhr.setRequestHeader('X-CSRF-Token', token);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};


var app = app || {};

(function($){

	var Reference = Backbone.Model.extend({
		defaults: {
			level: 0,
			name: "Name",
			pages: ""
		}
	});
	
	Collection = Backbone.Collection.extend({
		model: Reference,
		comparator: function(t){
			return parseFloat(t.get("level"));
		},
		initialize: function(){
			this.on("all", this.render, this);
			this.fetch();
		},
		render: function(eventName){
			this.sort({silent:true});
		},
		getPage: function(name){
			var model = this.find(function(ref){
				return parseFloat(ref.get("name")) == parseFloat(name);
			});
			return parseFloat(model.get("pages"));
		},
		getNames: function(){
			return this.pluck("name")
		},
		findByName: function(name){
			return this.find(function(ref){
				return ref.get("name") == name;
			})
		}
	});
	
	// Extends collection to all rails models
	Topics = Collection.extend({url: "/topics"});
	People = Collection.extend({
		url: "/people",
		comparator: function(m){
			var name = m.get("name"),
				names = name.split(" ");
			return names[1];
		}
	});
	Companies = Collection.extend({url: "/companies"});
	Letters = Collection.extend({url: "/letters"});

	app.topics = new Topics();
	app.people = new People();
	app.companies = new Companies();
	app.letters = new Letters();
	
})(jQuery);