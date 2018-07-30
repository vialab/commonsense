callback.textualTag = function(){


	var path = "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='textual/tag']").attr("meta");

	$.ajax({
		url: path,
		success: function(data){

			var lines = data.split("\n\n");

			$("div[module='textual/tag'] .metadata").html("");

			console.log(lines);

			var q = lines[0].split("\n");


			$("div[module='textual/tag'] .metadata").append("<strong>Q</strong> ");

			$.each(q, function(i,o){

				var array = o.split(" ");

				$.each(array, function(i,o){

					var html = "<span class='textual-tag-token q'>"+o+"</span> ";
					$("div[module='textual/tag'] .metadata").append(html);

				})

				$("div[module='textual/tag'] .metadata").append("<br>");


			});

			$("div[module='textual/tag'] .metadata").append("<hr>");



			var q = lines[1].split("\n");

			$("div[module='textual/tag'] .metadata").append("<strong>A</strong> ");

			$.each(q, function(i,o){

				var array = o.split(" ");

				$.each(array, function(i,o){

					var html = "<span class='textual-tag-token a'>"+o+"</span> ";
					$("div[module='textual/tag'] .metadata").append(html);

				})

				$("div[module='textual/tag'] .metadata").append("<br>");


			});

			$("div[module='textual/tag'] .metadata").append("<hr>");





			$("div[module='textual/tag'] .metadata").append("<h6 class='text-body'>Plot Synopsis</h6> ");

			var q = lines[2].split("\n");

			var ai = 0;

			$.each(q, function(i,o){

				var array = o.split(" ");

				$.each(array, function(i,o){

					var html = "<span class='textual-tag-token plain' index='"+ai+"'>"+o+"</span> ";
					$("div[module='textual/tag'] .metadata").append(html);

					ai++;

				})

				$("div[module='textual/tag'] .metadata").append("<br>");


			});




			$("div[module='textual/tag'] .metadata br:last").remove();

			var element = $("div[module='textual/tag']");
			var height = element.find(".content").outerHeight();
			element.css("height", height+"px");			

			if ($("#relational-textual-list-box").length > 0) {

				var newHeight = height - $("div[module='textual/tag'] div.card-header").outerHeight();

				$("#relational-textual-list-box").css("height", newHeight+"px");


				var element = $("div[module='relational/textual']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");			


			}


			$("div[module='textual/tag'] .metadata span").addClass("text-muted");


			$.each(trigger, function(i,o){

				o();

			});		


		} 
	})

}


$(document).on("click", "span.textual-tag-token", function(){

	console.log("CLICKED");

	if ($(this).hasClass("q")) {

		$("span.textual-tag-token.active:not(.q)").removeClass("active");

	} else if ($(this).hasClass("a")) {

		$("span.textual-tag-token.active:not(.a)").removeClass("active");

	} else {

		$("span.textual-tag-token.active.q, span.textual-tag-token.active.a").removeClass("active");

	}

	$(this).toggleClass("active");

});


$(document).on("click", "#textual-tag-add", function(){

	if ($("span.textual-tag-token.active").length > 0) {

		var text = "";

		$("span.textual-tag-token.active").each(function(i,o){

			var token = $(this).text();

			text += token + " ";

		});

		text = $.trim(text);


		var obj = {};

		obj.id = (new Date().getTime()).toString(16);
		obj.name = text;
		obj.text = text;

		if ($("span.textual-tag-token.active:first").hasClass("q")) {

			obj.type = "q";

		} else if ($("span.textual-tag-token.active:first").hasClass("a")) {

			obj.type = "a";

		} else {

			obj.type = "regular";

		}




		if (input.token == undefined) {

			input.token = {};

		}

		input.token[obj.id] = obj;

		


		if (input.position == undefined) {

			input.position = {};

		}

		if (input.position[obj.id] == undefined) {

			input.position[obj.id] = {};

		}


		if (input.video == undefined) {

			input.video = {};
			input.video.w = 490;
			input.video.h = 208;

		}

		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		var x = input.video.w * (getRandomInt(20, 80) / 100);
		var y = input.video.h * (getRandomInt(20, 80) / 100);
		input.position[obj.id].x = x;
		input.position[obj.id].y = y;


		$("span.textual-tag-token.active").removeClass("active");

		save();


		$.each(trigger, function(i,o){

			o();

		});		

		// trigger.relationalSummaryGenerate();


	}

	return false;

   	var text = "";

    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }


    if (text == "") {


    } else {


		var abs = Math.abs($("#textual-tag-scale input").val());
		var color = textualTag_hsvToRgb(abs, 100, 100);

		if (abs < 160 && abs > 80) {

			var textColor = "text-dark";

		} else {

			var textColor = "text-white";

		}


		var html = "<span class='badge "+textColor+" mr-2' style='background-color:rgb("+color.join(",")+")'>"+text+"</span>";

    	$("#textual-bin-tag").append(html);


		document.getSelection().removeAllRanges();

        $("a[href='#textual-bin-tag']").click();

		relationalSummaryInsert(text, "textual");

    }	

});


function textualTag_hsvToRgb(h, s, v) {
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

