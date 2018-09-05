callback.visualVideo = function(){

	var pane = document.getElementById("visual-video-pane");
	var meta = $("div[module='visual/video']").attr("meta");

	if (meta.indexOf(":") != -1) {

		var metaArray = meta.split(":");

		pane.src = "/generate/process/download.php?video&code="+metaArray[0];
		pane.type = "video/ogv";

		visualVideoFrames = metaArray[1];

	} else {

		pane.src = "/generate/process/download.php?video&code="+meta;
		pane.type = "video/ogv";

		visualVideoFrames = null;

	}





	// alert(pane.src);


	if ($("div[module='visual/overlay']").length == 0) {

		$("#visual-video-dots").remove();

	}

}

var visualVideoFrames = null;

// var fps = 23.965723763;
var fps = 23.916978399903464;

function visualVideoLoaded(){

	var initFrame = 1;

	if (window.location.hash.replace("#", "") != "") {

		initFrame = window.location.hash.replace("#", "");

	}

	var element = $("div[module='visual/video']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");



	var pane = document.getElementById("visual-video-pane");
	var duration = pane.duration;

	if (visualVideoFrames != null) {

		var frames = visualVideoFrames;
		fps = frames / duration;

	} else {

		var frames = Math.round(duration * fps);

	}


	$("#visual-video-timeline").attr("max", frames);


	$.each(animate, function(i,o){

		o();

	});

	visualVideoDraw();

	var pane = document.getElementById("visual-video-pane");

	if ($("#relational-visual-list-box").length > 0){

		var newHeight = $("#visual-video-pane").outerHeight();
		
		$("#relational-visual-list-box").css("height", newHeight+"px");

		if (input.video === undefined) {

			input.video = {};

		}

		input.video.w = $("#relational-visual-list-box").outerWidth();
		input.video.h = newHeight;

		save();

	}

	if ($("#relational-summary-canvas-container").length > 0){

		relationalSummaryHijackControls();

	};


	if (initFrame != "") {

		$("#visual-video-timeline").val(initFrame).trigger("input");

	}

	$.each(static, function(i,o){

		o();

	});

	

}

function visualVideoDraw(){


	var time = $("#visual-video-timeline").val();

	$("#visual-video-dots circle[time='"+time+"']").addClass("active");
	$("#visual-video-dots circle[time!='"+time+"']").removeClass("active");

	$("div.visual-bbox-bar").each(function(){

		$(this).find("circle[time='"+time+"']").addClass("active");
		$(this).find("circle[time!='"+time+"']").removeClass("active");

	});

	$("#visual-video-dots circle.active, div.visual-bbox-bar circle.active").each(function(){

		$(this).closest("svg").append($(this));
		
	})


	var id = requestAnimationFrame(visualVideoDraw);

	var pane = document.getElementById("visual-video-pane");


	if (pane != null && pane.paused === true){

		return false;

	}


	var pane = document.getElementById("visual-video-pane");

	if (pane != null) {

		var time = Math.round(pane.currentTime * fps);
		$("#visual-video-timeline").val(time);

		if (time == 0) {

			time = 1;

		}

		$("#visual-video-timeline").attr("value", time);
		$("#visual-video-frame").val(time + "/" + $("#visual-video-timeline").attr("max"));

	}



	$.each(animate, function(i,o){

		o();

	});


}


$(document).on("input", "#visual-video-timeline", function(){

	var frame = $(this).val();

	var pane = document.getElementById("visual-video-pane");

	var time = (frame - 1) / fps;

	pane.currentTime = time;

	window.history.replaceState({}, null, "#"+frame);
	$("#visual-video-frame").val(frame + "/" + $("#visual-video-timeline").attr("max"));

	// animate.visualOverlay();
	$.each(animate, function(i,o){

		o();

	});


});


$(document).on("click", "#visual-video-play", function(){

	var pane = document.getElementById("visual-video-pane");
	pane.play();

});



$(document).on("click", "#visual-video-pause", function(){

	var pane = document.getElementById("visual-video-pane");
	pane.pause();

	window.history.replaceState({}, null, "#"+$("#visual-video-timeline").val());
	
});



$(document).on("click", "#visual-video-dots circle", function(){

	var time = $(this).attr("time");

	var pane = document.getElementById("visual-video-pane");
	pane.pause();

	$("#visual-video-timeline").val(time).trigger("input");


});

