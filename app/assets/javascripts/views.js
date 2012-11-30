
var app = app || {};

(function($){

	var	sep			= ", ",
		$nav		= $("#listNav"),
		$edit		= $("#editReference"),
		$adjust		= $("#pageNums"),
		$find		= $("#findAdd"),
		$index		= $("#index");

	// Load functions
	$(function(){

		// App "start" variables
		app.entries = app.topics;
		app.table = "topics";
		app.pagesOn = true;

		// Create view instances
		app.indexView = new IndexView();
		app.adjustPage = new AdjustPage();
		app.findView = new FindView();

		// Set fixed heading spacing
		$(".moving").css("marginTop",$(".sticky").height());

		// Table tab toggling
		$("li a",$nav).click(function(){
			$(this).parent()
				.addClass("active")
				.siblings()
				.removeClass("active");
			var newCollect = $(this).attr("href");
			app.table = newCollect;
			// Set/fetch new models, re-initialize view
			app.entries = app[newCollect];
			app.entries.fetch();
			app.indexView.initialize();
			$("#csvLink").attr("href","/csv?t="+newCollect);
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
			this.$edName 	= $("#name",this.el);
			this.$edPages	= $("#pages",this.el);
			this.$edLevel	= $("#level",this.el);

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
				pgs		= (app.pagesOn) ? app.updatePages(pages,"") : app.formatPages(pages,"");

			this.selected.save({
				name: self.$edName.val(),
				pages: pgs,
				level: self.$edLevel.val()
			});
			return false;
		}
	});

	// Adjust page view
	var AdjustPage = Backbone.View.extend({
		el: $adjust,
		events: {
			"click #convertL"	: "convertL",
			"click #convertP"	: "convertP"
		},
		initialize: function(){
			$('[data-toggle="buttons-radio"] .btn').click(function(){
				$(this).addClass("active").siblings().removeClass("active");
			});
		},
		convertL: function(){
			app.pagesOn = false;
			_(app.topics.models).each(function(ref){
				var pages = ref.get("pages");
				if (pages!="") ref.save("pages",app.convertToLetters(pages));
			});
			_(app.companies.models).each(function(ref){
				var pages = ref.get("pages");
				if (pages!="") ref.save("pages",app.convertToLetters(pages));
			});
			_(app.people.models).each(function(ref){
				var pages = ref.get("pages");
				if (pages!="") ref.save("pages",app.convertToLetters(pages));
			});
		},
		convertP: function(){
			app.pagesOn = true;
			_(app.topics.models).each(function(ref){
				var pages = ref.get("pages");
				if (pages!="") ref.save("pages",app.convertToPages(pages));
			});
			_(app.companies.models).each(function(ref){
				var pages = ref.get("pages");
				if (pages!="") ref.save("pages",app.convertToPages(pages));
			});
			_(app.people.models).each(function(ref){
				var pages = ref.get("pages");
				if (pages!="") ref.save("pages",app.convertToPages(pages));
			});
		}
	});

	// Find/add view
	var FindView = Backbone.View.extend({
		el: $find,
		nameArray: [],
		events: {
			"change #searchRefs": "select",
			"submit #find"	: "update"
		},
		initialize: function(){
			_.bindAll(this,"update","select");
			this.$edName 	= $("#searchRefs",this.el);
			this.$edPages	= $("#addnew",this.el);

			var self = this;
			this.$edName.typeahead({
				source: function(){return self.nameArray}
			});

			app.topics.on("add reset change:name", this.updateArray, this);
			app.people.on("add reset change:name", this.updateArray, this);
			app.companies.on("add reset change:name", this.updateArray, this);
		},
		updateArray: function(){
			var topics		= app.topics.getNames(),
				people		= app.people.getNames(),
				companies	= app.companies.getNames();

			this.nameArray = topics.concat(people,companies);
		},
		select: function(){
			var name	= this.$edName.val(),
				topic	= app.topics.findByName(name),
				person	= app.people.findByName(name),
				company	= app.companies.findByName(name);

			if (name === "") return;
			if (topic==undefined && person==undefined && company==undefined)
				console.log("Reference not found.");
			else if (topic==undefined && person==undefined)
				this.selected = company;
			else if (topic==undefined && company==undefined)
				this.selected = person;
			else if (person==undefined && company==undefined)
				this.selected = topic;
			else alert("Error");
			console.log(this.selected);
		},
		update: function(){
			var self	= this,
				pages	= this.selected.get("pages"),
				newPgs 	= this.$edPages.val(),
				pgs		= (app.pagesOn) ? app.updatePages(pages,newPgs) : app.formatPages(pages,newPgs);

			this.selected.save({ pages: pgs });
			this.$edName.val("");
			this.$edPages.val("");
			return false;
		}
	});

	// Table row view
	var RowView = Backbone.View.extend({
		tagName: "tr",
		className: "index-row",
		template: JST['reference'],
		events: {
			"click"				: "select",
			"submit #add-new"	: "addNew",
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
			var pgs;
			if (app.table!="letters"){
				var pages	= this.model.get("pages"),
					newPgs 	= this.$(".add-pgs").val(),
					pgs		= (app.pagesOn) ? app.updatePages(pages,newPgs) : app.formatPages(pages,newPgs);
			}
			else pgs = this.$(".add-pgs").val();
			this.model.save("pages",pgs);
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