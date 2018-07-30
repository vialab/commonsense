callback.visualVideo = function(){

	var pane = document.getElementById("visual-video-pane");
	pane.src = "/generate/process/download.php?video&code="+$("div[module='visual/video']").attr("meta");
	pane.type = "video/ogv";




	// alert(pane.src);


}


function visualVideoLoaded(){

	var element = $("div[module='visual/video']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");


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

}

function visualVideoDraw(){

	var id = requestAnimationFrame(visualVideoDraw);

	var pane = document.getElementById("visual-video-pane");

	if (pane != null && pane.paused === true){

		return false;

	}

	$.each(animate, function(i,o){

		o();

	});


}


$(document).on("input", "#visual-video-timeline", function(){

	var percentage = $(this).val()/100;

	var pane = document.getElementById("visual-video-pane");

	var time = pane.duration * percentage;

	pane.currentTime = time;

	$.each(animate, function(i,o){

		o();

	});

});


animate.visualVideoUpdate = function(){

	var pane = document.getElementById("visual-video-pane");

	if (pane != null) {


		var time = pane.currentTime / pane.duration * 100;
		$("#visual-video-timeline").val(time.toFixed(1));


	}


}

$(document).on("click", "#visual-video-play", function(){

	var pane = document.getElementById("visual-video-pane");
	pane.play();

});



$(document).on("click", "#visual-video-pause", function(){

	var pane = document.getElementById("visual-video-pane");
	pane.pause();
	
});

