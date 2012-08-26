
var app = app || {};

(function($){
	
	app.pageToArr = function (str,add){
		var letters	= [],
			sort	= {},
			conc	= str + add,
			years	= conc.split(";");
		
		for (i in years){
			if ($.trim(years[i])!=""){;
				var yearpg	= years[i].split(":"),
					year	= parseFloat(yearpg[0]),
					pgs		= yearpg[1].split(",");
				
				for (p in pgs) pgs[p] = parseFloat(pgs[p]);
				pgs.sort(function(a,b){return a-b});
				if (sort[year]) {
					var newpgs = sort[year].concat(pgs);
					newpgs.sort(function(a,b){return a-b});
					newpgs = _.uniq(newpgs,true);
					sort[year] = newpgs;
				}
				else sort[year] = pgs;
				letters.push(year);
			}
		}
		letters.sort(function(a,b){return a-b});
		letters = _.uniq(letters,true);
		for (i in letters){
			letters[i] = [letters[i]];
			letters[i].push(sort[letters[i][0]]);
		}
		return letters;
	}
	
	app.formatPages = function (str,add){
		var string	= "",
			arr		= app.pageToArr(str,add);
		
		for (i in arr){
			string += arr[i][0] + ": ";
			string += arr[i][1].join(", ");
			string += ";  "
		}	
		return string;
	}
	
	app.convertToPages = function (str){
		var pgArr	= [],
			arr		= app.pageToArr(str,"");
		
		for (i in arr){
			var year	= arr[i][0],
				pgs		= arr[i][1],
				add		= app.letters.getPage(year);
			for (p in pgs) pgs[p] += add - 1;
			pgArr = pgArr.concat(pgs);
		}
		pgArr.sort(function(a,b){return a-b});
		
		return pgArr.join(", ");
	}
	
	app.convertToLetters = function (str){
		var string	= "",
			hash	= {},
			letters	= [],
			pgs		= str.split(","),
			yearObj	= app.letters.pluck("name").reverse();
			
		for (p in pgs){
			pgs[p] = parseFloat(pgs[p]);
			var stop = false;
			for (y in yearObj){
				var yearPg 	= app.letters.getPage(yearObj[y]),
					newPg	= pgs[p] - yearPg + 1;
				if (pgs[p]>=yearPg && !stop){
					if (hash[yearObj[y]]) {
						hash[yearObj[y]].push(newPg);
						hash[yearObj[y]].sort(function(a,b){return a-b});
					}
					else hash[yearObj[y]] = [newPg];
					letters.push(yearObj[y]);
					stop = true;
				}
			}
		}
		letters.sort(function(a,b){return a-b});
		letters = _.uniq(letters,true);
		for (i in letters) {
			letters[i] = [letters[i],hash[letters[i]]];
			string += letters[i][0] + ": ";
			string += letters[i][1].join(", ");
			string += ";  "
		}
		return string;
	}
	
	app.updatePages = function (str,add){
		var newsep	= (str==""||add=="") ? "" : ", ",
			conc	= str + newsep + add,
			arr		= conc.split(",");
		
		for (i in arr) arr[i] = parseFloat(arr[i]);
		arr.sort(function(a,b){return a-b});
		str = (isNaN(arr[0])) ? "" : arr.join(", ");
		
		return str;
	}

})(jQuery);