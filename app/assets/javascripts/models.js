
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

	var Topic = Backbone.Model.extend({
		urlRoot: "/topics",
		defaults: {
			level: 0,
			name: "Reference Name",
			pages: ""
		}
	});
	
	app.Topics = Backbone.Collection.extend({
		model: Topic,
		url: "/topics",
		comparator: function(t){
			return parseFloat(t.get("level"));
		},
		initialize: function(){
			this.on("all", this.render, this);
			this.fetch();
		},
		render: function(eventName){
			this.sort({silent:true});
		}
	});
	
	
})(jQuery);