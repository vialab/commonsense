callback.textualFreetext = function(){

	var freetext = "";

	var obj = {};

	obj.session = session_id;

	var meta = $("div[module='textual/freetext']").attr("meta");

	obj.meta = meta;

	if (obj.meta.indexOf("GRNOTES") != -1) {

		$("#textual-freetext-textarea").prop("disabled", true);

	}

	$.ajax({
		url: "/modules/textual/freetext/load.php",
		type: "GET",
		data: obj,		
		success: function(data){


			data = JSON.parse(data);

			$("#textual-freetext-textarea").val(data.CONTENT);

			if ((data.CONTENT === undefined || data.CONTENT === "") && session_id == 'SAMPLE' && extra_id != "") {
			
				$("#textual-freetext-textarea").val(extra_id);

			}

		}
	});


}

$(document).on("change", "#textual-freetext-textarea", function(){

	$(this).removeClass("animated rubberBand");

});

$(document).on("click", "#textual-freetext-save", function(){

	var obj = {};

	$("#textual-freetext-textarea").removeClass("animated rubberBand");			

	obj.text = $("#textual-freetext-textarea").val();
	obj.session = session_id;

	var meta = $("div[module='textual/freetext']").attr("meta");

	obj.meta = meta;

	$.ajax({
		url: "/modules/textual/freetext/upload.php",
		type: "POST",
		data: obj,		
		success: function(data){

			$("#textual-freetext-textarea").addClass("animated rubberBand");			

		}
	});



	// save();


});

$(document).on("click", "#textual-freetext-add", function(){


   	var text = $("#textual-freetext-textarea").val();


    if (text == "") {


    } else {


		var abs = Math.abs($("#textual-freetext-scale input").val());
		var color = textualFreetext_hsvToRgb(abs, 100, 100);

		if (abs < 160 && abs > 80) {

			var textColor = "text-dark";

		} else {

			var textColor = "text-white";

		}


		var html = "<span class='badge "+textColor+" mr-2' style='background-color:rgb("+color.join(",")+")'>"+text+"</span>";

    	$("#textual-bin-freetext").append(html);

        $("a[href='#textual-bin-freetext']").click();


		//relationalSummaryInsert(text, "textual");

    }	

});




function textualFreetext_hsvToRgb(h, s, v) {
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

