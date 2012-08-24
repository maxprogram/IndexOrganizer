
var GLOBALVARIABLES;

(function($){
	
	var	sep			= ", ",
		$change		= $("#changeButton"),
		$original	= $("#original"),
		$output		= $("#output"),
		$page		= $("#input_page"),
		$pages		= $("#input_pages");
	
	// Load functions
	$(function(){
		
		$change.click(loadNums);
		
	});

	function loadNums(){
		var	page		= parseInt($page.val()),
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