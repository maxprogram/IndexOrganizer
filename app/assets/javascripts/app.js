

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g,
    evaluate: /\{%(.+?)%\}/g	
};

var indexView;

(function($){
	
	var	sep			= ", ",
		$change		= $("#changeButton"),
		$edit		= $("#editReference"),
		$index		= $("#index"),
		$page		= $("#input_page"),
		$pages		= $("#input_pages"),
		$edName		= $("#name",$edit),
		$edPages	= $("#pages",$edit),
		$edLevel	= $("#level",$edit),
		$rowTemp	= $("#row-Template");
	
	// Load functions
	$(function(){
		
		indexView = new IndexView();
		$change.click(function(){});
		
		$(".moving").css("marginTop",$(".sticky").height());
		
	});
	
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

// MODELS

	var Topic = Backbone.Model.extend({
		urlRoot: "/topics",
		defaults: {
			level: 0,
			name: "Reference Name",
			pages: ""
		},
		initialize: function(){
			_.bindAll(this, "render");
			this.on("add", this.render);
		},
		render: function(){
			this.save();
		}
	});
	
	var Topics = Backbone.Collection.extend({
		model: Topic,
		url: "/topics",
		comparator: function(t){
			return parseFloat(t.get("level"));
		},
		initialize: function(){
			_.bindAll(this, "render");
			this.on("all", this.render);
			this.fetch();
		},
		render: function(eventName){
			this.sort({silent:true});
		}
	});

// VIEWS

	// Index view
	var IndexView = Backbone.View.extend({
		el: $edit,
		events: {
			"click .add"	: "add",
			"click .update"	: "update",
			"submit #edit"	: "update",
			"click .remove"	: "remove"
		},
		initialize: function(){
			_.bindAll(this,"render","add","editReference","update","remove","addCid");
			
			this.collection = new Topics();
			this.collection.on("add", this.addCid);
			this.collection.on("add change reset", this.render);
		},
		render: function(){
			var self = this, selected = false;
			$(".index-row",$index).remove();
			
			_(this.collection.models).each(function(ref,i){
				var rowView = new RowView({model: ref});
				$index.append(rowView.render().el);
				if (self.cid == ref.cid && !selected){
					rowView.selectRow();
					selected = true;
				}
				if (self.selected == ref && !selected){
					rowView.selectRow();
					selected = true;
				}
			});	
		},
		add: function(){
			this.collection.add();
		},
		addCid: function(ref){
			this.cid = ref.cid;
		},
		editReference: function(row){
			this.selected = row;
			$edName.val(row.get("name"));
			$edPages.val(row.get("pages"));
			$edLevel.val(row.get("level"));
		},
		update: function(){
			var pages 	= $edPages.val(),
				arr		= pages.split(",");
			for (i in arr) arr[i] = parseFloat(arr[i]);
			arr.sort(function(a,b){return a-b});
			pages = (isNaN(arr[0])) ? "" : arr.join(sep);
			
			this.selected.save({
				name: $edName.val(),
				pages: pages,
				level: $edLevel.val()
			});
			return false;
		},
		remove: function(){
			this.selected.destroy();
		}
	});

	// Table row view
	var RowView = Backbone.View.extend({
		tagName: "tr",
		className: "index-row",
		template: _.template($rowTemp.html()),
		events: {
			"click"				: "selectRow",
			"submit #add-new"	: "addNew"
		},
		initialize: function(){
			_.bindAll(this,"render","selectRow","addNew","remove","unrender");
			this.model.on("change", this.render);
			this.model.on("destroy", this.unrender);
		},
		render: function(){
			$(this.el).html(this.template(this.model.toJSON()));	
			return this;
		},
		selectRow: function(){
			$(this.el).parent().children().removeClass("active");
			$(this.el).addClass("active");
			
			indexView.editReference(this.model);
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
			$(this.el).remove();
		}
	});





	function loadNums(){
		var	page	= parseInt($page.val()),
			pages	= parseInt($pages.val());
		
		var header = $("<tr/>").html($(".head").html());
		$output.empty().append(header);
		
		$("tr",$original).each(function(i,row){
			if ($(row).hasClass("head")) return true;
			var newrow = $("<tr/>");
			
			$("td",row).each(function(i,cell){
				var content = $(cell).html();
				if (i==1) {
					var n = content.split(sep);
					for (i in n){
						n[i] = parseFloat(n[i]);
						if (n[i] > page) n[i] += pages;
						if (i != n.length - 1) n[i] += sep;
					}
					content = n.join("");
				}
				var newcell = $("<td/>").html(content);
				newrow.append(newcell);
			});
			
			$output.append(newrow);
		});
		
	}
	
})(jQuery);