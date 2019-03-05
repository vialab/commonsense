callback.infoText = function(){

	var filename = $("div[module='db/tag']").attr("meta");
	
	$.ajax({
		url: "/generate/process/download.php",
		type: "GET",
		datatype: "text",
		data: {
			code: filename
		},
		success: function(data){


			if ((typeof data) == "string") {

				data = JSON.parse(data);


			}

			// var html = md.render(data);

			// $("div[module='db/tag'] .card-body").html(html);

			// var data = JSON.parse(data);
			var body = $("div[module='db/tag'] .card-body");


			$.each(data, function(i,o){

				body.append("<"+o.type+"></"+o.type+">");
				
				var element = body.find(o.type+":last");

				$.each(o.list, function(j,p){

					var html = "span";
					var color = hsvToRgb(0, 0, 80);

					if (p.h != undefined) {

						html = p.h;

					}

					var addon = "";
					var attr = "";

					if (p.v != undefined) {

						var value = 1 - p.v;

						value = value * 240 / 1;

						color = hsvToRgb(value, 100, 100);

						addon = "<div style='background-color: rgb("+color+")'></div>";


					} else {

						
					}				



					element.append("<"+html+" "+attr+">"+p.t+addon+"</"+html+"> ");

				});


			});

			var element = $("div[module='db/tag']");
			var height = element.find(".content").outerHeight();
			element.css("height", height+"px");	


		}

	});	

}

$(document).on("click", "div[module='db/tag'] span", function(){


	$(this).toggleClass("active");


	var textArray = [];
	var indexArray = [];
	var wordArray = [];

	$("div[module='db/tag'] span.active").each(function(i,o){


		var sentence = $(this).parent().index();
		var word = $(this).index();

		var index = sentence+":"+word;
		indexArray.push(index);
		wordArray.push(word);


		if (i > 0){

			if (wordArray[i-1] != word-1) {

				textArray.push(" ... " + $(this).text());

			} else {

				textArray.push($(this).text());

			}

		} else {

			textArray.push($(this).text());

		}

	});



	if (textArray.length > 0) {

		var textString = textArray.join(" ");
		$("#cwc_asset_add span").text(': "'+textString+'"');
		$("#cwc_asset_add").attr("text", textString);
		$("#cwc_asset_add").attr("tag", JSON.stringify(indexArray));

	} else {

		$("#cwc_asset_add span").empty();
		$("#cwc_asset_add").removeAttr("text");
		$("#cwc_asset_add").removeAttr("tag");

	}



});



$(document).on("click", "#cwc_asset_add", function(e){

	e.preventDefault();

	var name = $("#cwc_asset_add").attr("text");
	var id = $(this).attr("db");
	var meta = $("div[module='db/asset']").attr("meta");
	var name2 = $("#cwc_asset_add").attr("text");
	var tag = $("#cwc_asset_add").attr("tag");


	if (id != "" && name != undefined && name != "") {

		$.ajax({
			url: "/modules/db/asset/add.php",
			type: "POST",
			data: {
				id: id,
				name: name,
				name2: name2,
				session: session_id,
				meta: meta,
				tag: tag,
			},		
			success: function(data){

				$.each(poll, function(i,o){

					o();

				});
				
				$("div[module='info/text'] span.active").removeClass("active");
				$("#cwc_asset_add span").empty();
				$("#cwc_asset_add").removeAttr("text");			
				$("div[module='db/tag'] span.active").removeClass("active");
			}
		});

	}


});


function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
 
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
 
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
 
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
 
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
 
	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
 
		case 1:
			r = q;
			g = v;
			b = p;
			break;
 
		case 2:
			r = p;
			g = v;
			b = t;
			break;
 
		case 3:
			r = p;
			g = q;
			b = v;
			break;
 
		case 4:
			r = t;
			g = p;
			b = v;
			break;
 
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
 
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}



$(document).on("click", "#cwc_db_tag_coref", function(e){



	var payload = {
		coref: $("#db-tag-tokens").text().trim()
	}

	$.ajax({
		url: "/test.php",
		type: "POST",
		data: {
			data: JSON.stringify(payload)
		},
		success: function(data){

		}
	});

});