var annotateVideoFrames = null;
var annotateVideoCurrentFrame = null;
var annotateVideoPlayer = null;

callback.annotateVideo = function(){

	annotateVideoPlayer = $("#annotate_video_player")[0];
	var meta = $("div[module='annotate/video']").attr("meta");

	if (meta.indexOf(":") != -1) {

		var metaArray = meta.split(":");

		annotateVideoPlayer.src = "/generate/process/download.php?video&code="+metaArray[0];
		annotateVideoPlayer.type = "video/ogv";

		annotateVideoFrames = metaArray[1];

	} else {

		annotateVideoPlayer.src = "/generate/process/download.php?video&code="+meta;
		annotateVideoPlayer.type = "video/ogv";

		annotateVideoFrames = null;

	}




}

function annotateVideoLoaded(){

	var element = $("#annotate_video");
	var height = element.outerHeight();

	$("div[module='annotate/video']").css("height", height+"px");

	$("#annotate_video_max").val(annotateVideoFrames);
	$("#annotate_video_slider").attr("max", annotateVideoFrames);
	$("#annotate_video_current").attr("max", annotateVideoFrames);

	var frame = window.location.hash.replace("#", "");

	if (frame == "") {

		frame = 1;

	}


	$("#annotate_video_slider").val(frame);
	$("#annotate_video_current").val(frame);
	window.history.replaceState({}, null, "#"+frame);


	annotateGraphPlace();
	annotateVideoMove();
	

	const performAnimation = () => {
	  request = requestAnimationFrame(performAnimation)




	  if (annotateVideoPlayer.paused == true) {



	  } else {


		var interval = annotateVideoPlayer.duration / annotateVideoFrames;
		var frame = Math.ceil(annotateVideoPlayer.currentTime / interval);

		$("#annotate_video_slider").val(frame);
		$("#annotate_video_current").val(frame);

		annotateVideoCurrentFrame = frame;
		window.history.replaceState({}, null, "#"+annotateVideoCurrentFrame);

		annotateVideoPaint();


	  }


	}

	requestAnimationFrame(performAnimation)


}



$(document).on("focus", "#annotate_video_slider", function(e){

	$("#annotate_video_slider").blur();
	e.preventDefault();

});



$(document).on("input", "#annotate_video_slider", function(){

	var value = $(this).val();
	$("#annotate_video_current").val(value);
	window.history.replaceState({}, null, "#"+value);
	$("#annotate_video_slider").blur();

	annotateVideoMove();

});

$(document).on("input", "#annotate_video_current", function(){

	var value = $(this).val();

	var max = parseInt($(this).attr("max"));

	if (value > max) {

		value = max;
		$("#annotate_video_current").val(value);

	}

	$("#annotate_video_slider").val(value);
	window.history.replaceState({}, null, "#"+value);

	annotateVideoMove();

});

function annotateVideoMove(){


	var interval = annotateVideoPlayer.duration / annotateVideoFrames;
	annotateVideoCurrentFrame = $("#annotate_video_current").val();
	var time = interval * (annotateVideoCurrentFrame); // OFFSET UNCLEAR HERE

	annotateVideoPlayer.currentTime = time;


	annotateVideoPaint();


}

function annotateVideoPaint(){

	var percentage = (annotateVideoCurrentFrame - 1) / (annotateVideoFrames - 1) * 100;

	$(".annotate_asset_time_indicator").attr("x", "calc("+percentage+"% - 1px)");


	$(".annotate_asset_bbox_dot[time='"+annotateVideoCurrentFrame+"']").attr("fill", "red");
	$(".annotate_asset_bbox_dot[time!='"+annotateVideoCurrentFrame+"']").attr("fill", "black");

	$(".annotate_asset_graph_dot[time='"+annotateVideoCurrentFrame+"']").attr("fill", "red");
	$(".annotate_asset_graph_dot[time!='"+annotateVideoCurrentFrame+"']").attr("fill", "black");


	$("#annotate_video_svg_dots").empty();
	$("#annotate_video_svg_boxes").empty();

	var group_dots = $("#annotate_video_svg_dots")[0];
	var group_boxes = $("#annotate_video_svg_boxes")[0];


	$(".annotate_asset_bbox_dot[time='"+annotateVideoCurrentFrame+"']").each(function(){


		var x1 = parseFloat($(this).attr("o0_x"));
		var y1 = parseFloat($(this).attr("o0_y"));

		var circle = annotateAssetMakeSVG("circle", {cx: x1+"%", cy: y1+"%", fill: "black", "stroke-width": 2, "stroke": "white", r: 10, class: 'annotate_video_bbox_dot', point: $(this).attr("o0_id"), overlay: $(this).attr("overlay"), actor: $(this).attr("actor")});
		group_dots.appendChild(circle);


		var x2 = parseFloat($(this).attr("o1_x"));
		var y2 = parseFloat($(this).attr("o1_y"));


		var circle = annotateAssetMakeSVG("circle", {cx: x2+"%", cy: y2+"%", fill: "black", "stroke-width": 2, "stroke": "white", r: 10, class: 'annotate_video_bbox_dot', point: $(this).attr("o1_id"), overlay: $(this).attr("overlay"), actor: $(this).attr("actor")});
		group_dots.appendChild(circle);



		var width = Math.abs(x1 - x2);
		var height = Math.abs(y1 - y2);


		if (x1 < x2 && y1 < y2) {

			var x = x1;
			var y = y1;

		} else if (x1 > x2 && y1 < y2) {

			var x = x2;
			var y = y1;


		} else if (x1 > x2 && y1 > y2) {

			var x = x2;
			var y = y2;

		} else {

			var x = x1;
			var y = y2;


		}

		var hex = annotateAssetColors[$(this).attr("colorIndex")];

		var rect = annotateAssetMakeSVG("rect", {x: x+"%", y: y+"%", height: height+"%", width: width+"%", fill: "#"+hex, "stroke-width": 1, "stroke": "white", class: 'annotate_video_bbox_box', overlay: $(this).attr("overlay")});
		group_boxes.appendChild(rect);


	});

	// var time = (frame - 1) / fps;

	// pane.currentTime = time;

	// window.history.replaceState({}, null, "#"+frame);

	// $("#nav a").each(function(){

	// 	var array = $(this).attr("href").split("#");
	// 	var link = array[0]+"#"+frame;
	// 	$(this).attr("href", link);

	// });

	// $("#visual-video-frame").val(frame + "/" + $("#visual-video-timeline").attr("max"));

	$(".annotate_graph_stage_dot").each(function(){

		var actor = $(this).attr("actor");

		var find = $(".annotate_asset_graph_dot[time='"+annotateVideoCurrentFrame+"'][actor='"+actor+"']");

		if (find.length > 0) {

			var x = parseFloat(find.attr("x"));
			var y = parseFloat(find.attr("y"));
			var rotate = parseFloat(find.attr("rotate"));
			var actor = find.attr("actor");

			$(".annotate_graph_stage_dot[actor='"+actor+"']").attr("cx", x+"%");
			$(".annotate_graph_stage_dot[actor='"+actor+"']").attr("cy", y+"%");

			$(".annotate_graph_stage_view[actor='"+actor+"']").attr("x", x+"%");
			$(".annotate_graph_stage_view[actor='"+actor+"']").attr("y", y+"%");
			$(".annotate_graph_stage_view[actor='"+actor+"']").css("transform-origin", ""+x+"% "+y+"%");

		    $(".annotate_graph_stage_view[actor='"+actor+"']").css("transform", "rotate("+rotate+"deg)");
		    $(".annotate_graph_stage_view[actor='"+actor+"']").attr("rotate", rotate);

		} else {



			for (var i = annotateVideoCurrentFrame; i >= 1; i--) {

				var find = $(".annotate_asset_graph_dot[time='"+i+"'][actor='"+actor+"']");

				if (find.length > 0) {


					var x = parseFloat(find.attr("x"));
					var y = parseFloat(find.attr("y"));
					var rotate = parseFloat(find.attr("rotate"));
					var actor = find.attr("actor");

					$(".annotate_graph_stage_dot[actor='"+actor+"']").attr("cx", x+"%");
					$(".annotate_graph_stage_dot[actor='"+actor+"']").attr("cy", y+"%");

					$(".annotate_graph_stage_view[actor='"+actor+"']").attr("x", x+"%");
					$(".annotate_graph_stage_view[actor='"+actor+"']").attr("y", y+"%");
					$(".annotate_graph_stage_view[actor='"+actor+"']").css("transform-origin", ""+x+"% "+y+"%");

				    $(".annotate_graph_stage_view[actor='"+actor+"']").css("transform", "rotate("+rotate+"deg)");
				    $(".annotate_graph_stage_view[actor='"+actor+"']").attr("rotate", rotate);


					break;

				}

			}

		}


	});

	// $(".annotate_asset_graph_dot[time='"+annotateVideoCurrentFrame+"']").each(function(){


	// 	var x = parseFloat($(this).attr("x"));
	// 	var y = parseFloat($(this).attr("y"));
	// 	var rotate = parseFloat($(this).attr("rotate"));
	// 	var actor = $(this).attr("actor");

	// 	$(".annotate_graph_stage_dot[actor='"+actor+"']").attr("cx", x+"%");
	// 	$(".annotate_graph_stage_dot[actor='"+actor+"']").attr("cy", y+"%");

	// 	$(".annotate_graph_stage_view[actor='"+actor+"']").attr("x", x+"%");
	// 	$(".annotate_graph_stage_view[actor='"+actor+"']").attr("y", y+"%");
	// 	$(".annotate_graph_stage_view[actor='"+actor+"']").css("transform-origin", ""+x+"% "+y+"%");

	//     $(".annotate_graph_stage_view[actor='"+actor+"']").css("transform", "rotate("+rotate+"deg)");
	//     $(".annotate_graph_stage_view[actor='"+actor+"']").attr("rotate", rotate);

	// });

}


var annotateVideoBboxActive = null;
var annotateVideoBboxActiveRect = null;
var annotateVideoBboxActiveRectX = null;
var annotateVideoBboxActiveRectY = null;
var annotateVideoBboxActiveRectCurX = null;
var annotateVideoBboxActiveRectCurY = null;
var annotateVideoBboxActiveRectCurW = null;
var annotateVideoBboxActiveRectCurH = null;

$(document).on("mousedown", ".annotate_video_bbox_dot", function(){

	annotateVideoBboxActive = $(this).attr("point");



});


$(document).on("mouseup", ".annotate_video_bbox_dot", function(e){



	var curY = (e.pageY - $("#annotate_video_svg").position().top) / $("#annotate_video_svg").outerHeight() * 100;
	var curX = (e.pageX - $("#annotate_video_svg").position().left) / $("#annotate_video_svg").outerWidth() * 100;

	var obj = {
		overlay_point_id: annotateVideoBboxActive,
		x: curX,
		y: curY
	}

	$.ajax({
		url: "/modules/annotate/video/update_overlay_point.php",
		type: "POST",
		data: obj,
		success: function(data){

			annotateLogInsert("<i class='fa fa-pencil-alt'></i> Bbox Annotation.", obj);
			

		}
	});

	annotateVideoBboxActive = null;


});


$(document).on("mouseleave", "#annotate_video_svg", function(e){

	annotateVideoBboxActive = null;
	annotateVideoBboxActiveRect = null;

});

$(document).on("mousemove", "#annotate_video_svg", function(e){


	if (annotateVideoBboxActive != null) {


		var curY = (e.pageY - $("#annotate_video_svg").position().top) / $("#annotate_video_svg").outerHeight() * 100;
		var curX = (e.pageX - $("#annotate_video_svg").position().left) / $("#annotate_video_svg").outerWidth() * 100;


		$(".annotate_video_bbox_dot[point='"+annotateVideoBboxActive+"']").attr("cx", curX+"%");
		$(".annotate_video_bbox_dot[point='"+annotateVideoBboxActive+"']").attr("cy", curY+"%");


		var overlay_id = $(".annotate_video_bbox_dot[point='"+annotateVideoBboxActive+"']").attr("overlay");


		var dot0 = $(".annotate_video_bbox_dot[overlay='"+overlay_id+"']:first");
		var dot1 = $(".annotate_video_bbox_dot[overlay='"+overlay_id+"']:last");




		var x1 = parseFloat(dot0.attr("cx").replace("%", ""));
		var y1 = parseFloat(dot0.attr("cy").replace("%", ""));

		var x2 = parseFloat(dot1.attr("cx").replace("%", ""));
		var y2 = parseFloat(dot1.attr("cy").replace("%", ""));


		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o0_id", dot0.attr("point"));
		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o0_x", x1);
		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o0_y", y1);


		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o1_id", dot1.attr("point"));
		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o1_x", x2);
		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o1_y", y2);


		var width = Math.abs(x1 - x2);
		var height = Math.abs(y1 - y2);

		if (x1 < x2 && y1 < y2) {

			var x = x1;
			var y = y1;

		} else if (x1 > x2 && y1 < y2) {

			var x = x2;
			var y = y1;


		} else if (x1 > x2 && y1 > y2) {

			var x = x2;
			var y = y2;

		} else {

			var x = x1;
			var y = y2;


		}

		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("x", x+"%");
		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("y", y+"%");
		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("width", width+"%");
		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("height", height+"%");



	} else if (annotateVideoBboxActiveRect != null) {




		var curY = (e.pageY - $("#annotate_video_svg").position().top) / $("#annotate_video_svg").outerHeight() * 100;
		var curX = (e.pageX - $("#annotate_video_svg").position().left) / $("#annotate_video_svg").outerWidth() * 100;

		var deltaY = annotateVideoBboxActiveRectCurY - curY;
		var deltaX = curX - annotateVideoBboxActiveRectCurX;

		var x = annotateVideoBboxActiveRectX + deltaX;
		var y = annotateVideoBboxActiveRectY - deltaY;



		// var x = rectX

		$(".annotate_video_bbox_box[overlay='"+annotateVideoBboxActiveRect+"']").attr("x", x+"%");
		$(".annotate_video_bbox_box[overlay='"+annotateVideoBboxActiveRect+"']").attr("y", y+"%");

		$(".annotate_video_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']:first").attr("cx", x+"%");
		$(".annotate_video_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']:first").attr("cy", y+"%");


		$(".annotate_video_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']:last").attr("cx", (x+annotateVideoBboxActiveRectW)+"%");
		$(".annotate_video_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']:last").attr("cy", (y+annotateVideoBboxActiveRectH)+"%");



	}

});


$(document).on("click", ".annotate_asset_bbox_hide", function(e){

	var id = $(this).closest(".annotate_asset_item").attr("db");


	$(".annotate_video_bbox_dot[actor='"+id+"']").each(function(i,o){

		var point = $(this).attr("point");

		$(this).attr("cx", "100%");
		$(this).attr("cy", "100%");

		var overlay_id = $(".annotate_video_bbox_dot[point='"+point+"']").attr("overlay");


		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("x", "100%");
		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("y", "100%");
		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("width", "0%");
		$(".annotate_video_bbox_box[overlay='"+overlay_id+"']").attr("height", "0%");

		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o"+i+"_id", point);
		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o"+i+"_x", 100);
		$(".annotate_asset_bbox_dot[overlay='"+overlay_id+"']").attr("o"+i+"_y", 100);

		var obj = {
			overlay_point_id: point,
			x: 100,
			y: 100
		};

		$.ajax({
			url: "/modules/annotate/video/update_overlay_point.php",
			type: "POST",
			data: obj,
			success: function(data){

				annotateLogInsert("<i class='fa fa-pencil-alt'></i> Bbox Annotation.", obj);
				

			}
		});


	});

});





$(document).on("click", "#annotate_video_play", function(e){

	annotateVideoPlayer.play();

});




$(document).on("click", "#annotate_video_pause", function(e){

	annotateVideoPlayer.pause();

});


$(document).on("mouseup", ".annotate_video_bbox_box", function(e){



	var element = $(".annotate_video_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']:first");
	var point1 = element.attr("point");
	var x1 = element.attr("cx").replace("%", "");
	var y1 = element.attr("cy").replace("%", "");


	var obj = {
		overlay_point_id: point1,
		x: x1,
		y: y1
	}

	$.ajax({
		url: "/modules/annotate/video/update_overlay_point.php",
		type: "POST",
		data: obj,
		success: function(data){

			annotateLogInsert("<i class='fa fa-pencil-alt'></i> Bbox Annotation.", obj);
			

		}
	});



	var element = $(".annotate_video_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']:last");
	var point2 = element.attr("point");
	var x2 = element.attr("cx").replace("%", "");
	var y2 = element.attr("cy").replace("%", "");


	var obj2 = {
		overlay_point_id: point2,
		x: x2,
		y: y2
	}

	$.ajax({
		url: "/modules/annotate/video/update_overlay_point.php",
		type: "POST",
		data: obj2,
		success: function(data){

			annotateLogInsert("<i class='fa fa-pencil-alt'></i> Bbox Annotation.", obj2);
			

		}
	});


	$(".annotate_asset_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']").attr("o0_id", point1);
	$(".annotate_asset_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']").attr("o0_x", x1);
	$(".annotate_asset_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']").attr("o0_y", y1);

	$(".annotate_asset_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']").attr("o1_id", point2);
	$(".annotate_asset_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']").attr("o1_x", x2);
	$(".annotate_asset_bbox_dot[overlay='"+annotateVideoBboxActiveRect+"']").attr("o1_y", y2);


	annotateVideoBboxActiveRect = null;

	annotateVideoBboxActiveRectCurX = null;
	annotateVideoBboxActiveRectCurY = null;
	annotateVideoBboxActiveRectX = null;
	annotateVideoBboxActiveRectY = null;
	annotateVideoBboxActiveRectW = null;
	annotateVideoBboxActiveRectH = null;



});

$(document).on("mousedown", ".annotate_video_bbox_box", function(e){

	annotateVideoBboxActiveRect = $(this).attr("overlay");
	annotateVideoBboxActiveRectCurX = (e.pageX - $("#annotate_video_svg").position().left) / $("#annotate_video_svg").outerWidth() * 100;
	annotateVideoBboxActiveRectCurY = (e.pageY - $("#annotate_video_svg").position().top) / $("#annotate_video_svg").outerHeight() * 100;

	annotateVideoBboxActiveRectX = parseFloat($(".annotate_video_bbox_box[overlay='"+annotateVideoBboxActiveRect+"']").attr("x").replace("%", ""));
	annotateVideoBboxActiveRectY = parseFloat($(".annotate_video_bbox_box[overlay='"+annotateVideoBboxActiveRect+"']").attr("y").replace("%", ""));
	annotateVideoBboxActiveRectW = parseFloat($(".annotate_video_bbox_box[overlay='"+annotateVideoBboxActiveRect+"']").attr("width").replace("%", ""));
	annotateVideoBboxActiveRectH = parseFloat($(".annotate_video_bbox_box[overlay='"+annotateVideoBboxActiveRect+"']").attr("height").replace("%", ""));


});

