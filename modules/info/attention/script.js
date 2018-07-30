trigger.infoAttention = function(){

	var path = "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='info/attention']").attr("meta");

	$.ajax({
		url: path,
		success: function(data){

			$("#info-attention-bars").empty();

			var data = JSON.parse(data);

			console.log(data);

			var scoreList = [];

			$.each(data, function(i,o){

				$("#info-attention-bars").append('<div style="flex: 1" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" score="'+o+'"></div>');

				scoreList.push(o);

			});

			var max = Math.max(...scoreList);
			var min = Math.min(...scoreList);

			var normalList = 0;

			$("#info-attention-bars div[score]").each(function(i, o){

				var score = parseFloat($(this).attr("score"))*-1;
				var normal = (score - min) / (max - min);

				var jet = normal * -240 + 240;
				var abs = Math.abs(jet);

				$(this).attr("normal", normal);

				var color = hsvToRgb(abs, 100, 100);
				color = color.join(",");

				$(this).css("background-color", "rgb("+color+")");

				normalList += normal;


				$("span.textual-tag-token.plain[index='"+i+"']").css("border-bottom", "3px solid rgb("+color+")");



			})


			var avg = normalList / $("#info-attention-bars div[score]").length;




		} 
	})


	// var path = $("div[module='info/embed']").attr("meta");

	// var html = '<iframe class="border-0 w-100 h-100 d-block" allowfullscreen src="'+path+'" height="480"></iframe>';

	// $("div[module='info/embed']").html(html);



}

$(document).on("mouseenter", "#info-attention-bars div[score]", function(){

	var index = $(this).index();
	// var length = $("#info-attention-bars div[score]").length;

	// var tokens = $("span.textual-tag-token.plain").length - 1;

	// var percentage = index / length;

	// var tokenIndex = Math.round(tokens * percentage);

	$("span.textual-tag-token.plain.highlight").removeClass("highlight");

	$("span.textual-tag-token.plain[index='"+index+"']").addClass("highlight");
	$("span.textual-tag-token.plain[index='"+index+"']").css("background-color", "#ccc");

});

$(document).on("mouseleave", "#info-attention-bars div[score]", function(){

	$("span.textual-tag-token.plain.highlight").css("background-color", "transparent");
	$("span.textual-tag-token.plain.highlight").removeClass("highlight");


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
