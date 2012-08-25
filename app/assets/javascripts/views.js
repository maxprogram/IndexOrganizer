
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g,
    evaluate: /\{%(.+?)%\}/g	
};

var app = app || {};

(function($){
	
	var	sep			= ", ",
		$nav		= $("#listNav"),
		$edit		= $("#editReference"),
		$index		= $("#index"),
		$rowTemp	= $("#row-Template");
	
	// Load functions
	$(function(){
		
		app.entries = app.topics;
		app.indexView = new IndexView();
		
		$(".moving").css("marginTop",$(".sticky").height());
		
		$("li a",$nav).click(function(){
			$(this).parent()
				.addClass("active")
				.siblings()
				.removeClass("active");
			var newCollect = $(this).attr("href");

			app.entries = app[newCollect];
			app.entries.fetch();
			app.indexView.initialize();
			return false;
		});
		
	});

	// Index view
	var IndexView = Backbone.View.extend({
		el: $edit,
		events: {
			"click .add"	: "add",
			"submit #edit"	: "update",
			"click .remove"	: "remove"
		},
		initialize: function(){
			_.bindAll(this,"add","edit","update","remove");
			this.$edName 	= $("#name",this.el),
			this.$edPages	= $("#pages",this.el),
			this.$edLevel	= $("#level",this.el),
			
			app.entries.off();
			app.entries.on("add", this.addRecent, this);
			app.entries.on("add change reset", this.render, this);
		},
		render: function(){
			var self = this, selected = false;
			$(".index-row",$index).remove();
			
			_(app.entries.models).each(function(ref,i){
				var rowView = new RowView({model: ref});
				$index.append(rowView.render().el);
				if (self.recent == ref && !selected){
					rowView.select();
					selected = true;
				}
				if (self.selected == ref && !selected){
					rowView.select();
					selected = true;
				}
			});	
		},
		add: function(){
			app.entries.create();
		},
		remove: function(){
			this.selected.destroy();
		},
		addRecent: function(ref){
			this.recent = ref;
		},
		edit: function(ref){
			this.selected = ref;
			this.$edName.val(ref.get("name"));
			this.$edPages.val(ref.get("pages"));
			this.$edLevel.val(ref.get("level"));
		},
		update: function(){
			var self	= this,
				pages 	= this.$edPages.val(),
				arr		= pages.split(",");
			for (i in arr) arr[i] = parseFloat(arr[i]);
			arr.sort(function(a,b){return a-b});
			pages = (isNaN(arr[0])) ? "" : arr.join(sep);
			
			this.selected.save({
				name: self.$edName.val(),
				pages: pages,
				level: self.$edLevel.val()
			});
			return false;
		}
	});

	// Table row view
	var RowView = Backbone.View.extend({
		tagName: "tr",
		className: "index-row",
		template: _.template($rowTemp.html()),
		events: {
			"click"				: "select",
			"submit #add-new"	: "addNew"
		},
		initialize: function(){
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.unrender, this);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		},
		select: function(){
			$(this.el).parent().children().removeClass("active");
			$(this.el).addClass("active");
			
			app.indexView.edit(this.model);
		},
		addNew: function(){
			var pages	= this.model.get("pages"),
				newPgs 	= this.$(".add-pgs").val(),
				newsep	= (pages=="") ? "" : ",",
				conc	= pages + newsep + newPgs,
				arr		= conc.split(",");
			for (i in arr) arr[i] = parseFloat(arr[i]);
			arr.sort(function(a,b){return a-b});
			pages = (isNaN(arr[0])) ? "" : arr.join(sep);
			
			this.model.save("pages",pages);
			return false;
		},
		remove: function(){
			this.model.destroy();
		},
		unrender: function(){
			this.$el.remove();
		}
	});


	
})(jQuery);