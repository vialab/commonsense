callback.visualBbox = function(){

	$("#visual-video-toggle").append("<button class='btn btn-primary active btn-sm'>Bounding Box</button>");

	if (input.bbox == undefined) {

		input.bbox = [];

	}	

}

function visualBboxSave(){

	var list = {};

	$("#visual-bbox-timeline div.visual-bbox-bar[index]").each(function(i,o){

		var index = $(this).attr("index");

		var item = {};

		item.id = index;
		item.list = [];


		$(this).find("circle:not(.visual-bbox-cursor)").each(function(){

			var dot = {};
			dot.percentage = parseFloat($(this).attr("percentage"));
			dot.hidden = $(this).hasClass("hidden");
			dot.x = parseFloat($(this).attr("x"));
			dot.y = parseFloat($(this).attr("y"));
			dot.w = parseFloat($(this).attr("w"));
			dot.h = parseFloat($(this).attr("h"));

			console.log(dot);

			item.list.push(dot);

		});

		list[index] = item;

	});

	input.bbox = list;

	save();


}

animate.visualBbox = function(){


	var totalFrames = parseInt($("#visual-video-pane").attr("total")) - 1; 


	var pane = document.getElementById("visual-video-pane");

	if (pane != null) {


		var percentage = pane.currentTime / pane.duration * 100;

		if (!isNaN(percentage)) {

			$(".visual-bbox-cursor").attr("cx", percentage+"%");

		}

		visualBboxDisplay();



	}

}

function visualBboxInsert(index, text){

	$("#visual-bbox-alert").hide();

	$("#visual-bbox-timeline").append("<div index='"+index+"' class='visual-bbox-bar  pb-3 mb-3 border-bottom'><div class='align-self-center'><h6>"+text+"</h6><div class='bg-light border position-relative' style='height:10px;'><svg class='position-absolute h-100 w-100' style='left:0; top:0; overflow: visible;'></svg></div></div><div class='align-self-center mt-2'><button class='btn btn-primary btn-sm visual-bbox-insert'><i class='fa fa-plus'></i></button> <!--<button class='btn btn-secondary btn-sm visual-bbox-hide'><i class='far fa-circle'></i></button> --><button class='btn btn-primary btn-sm visual-bbox-spot'><i class='fa fa-chevron-down'></i></button> <button class='btn btn-danger btn-sm visual-bbox-remove'><i class='fa fa-minus'></i></button></div></div>")

	var element = $("div[module='visual/bbox']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");

	var bar = $("div.visual-bbox-bar[index='"+index+"']").find("svg")[0];

	var path = visualBboxInsertMakeSvg("circle", { cx: "0%", cy: 5, r:1, fill: "red", class: "position-absolute visual-bbox-cursor" });
	bar.appendChild(path);


}


function visualBboxDelete(index){



}


$(document).on("click", ".visual-bbox-remove", function(){

	var value = parseFloat($("#visual-video-timeline").val());

	$(this).closest("div.visual-bbox-bar").find("circle[percentage='"+value+"']").remove();
	$(this).closest("div.visual-bbox-bar").find("circle[percentage='"+(value+0.1)+"']").remove();
	$(this).closest("div.visual-bbox-bar").find("circle[percentage='"+(value-0.1)+"']").remove();

	visualBboxSave();
	visualBboxDisplay();


});


// $(document).on("keyup", function(e){

// 	return false;

// 	if ($("input[type='text']:focus").length > 0) {

// 		return false;

// 	}

// 	if (e.which == 81) {

// 		var pane = document.getElementById("visual-video-pane");

// 		if (pane.paused == true) {

// 			pane.play();

// 		} else {

// 			pane.pause();

// 		}

// 	} else if (e.which == 87) {

// 		var pane = document.getElementById("visual-video-pane");

// 		pane.pause();

// 		var value = parseFloat($("#visual-video-timeline").val());

// 		value -= 0.1;

// 		$("#visual-video-timeline").val(value).trigger("input");

// 	} else if (e.which == 69) {

// 		var pane = document.getElementById("visual-video-pane");

// 		pane.pause();

// 		var value = parseFloat($("#visual-video-timeline").val());

// 		value += 0.1;

// 		$("#visual-video-timeline").val(value).trigger("input");

// 	} else {


// 		var number = e.which - 49;
// 		$("div.visual-bbox-bar:eq("+number+")").find("button.visual-bbox-insert").click();


// 	}


// });

$(document).on("click", ".visual-bbox-hide", function(){

	var value = $("#visual-video-timeline").val();


	if ($(this).closest("div.visual-bbox-bar").find("circle[percentage='"+value+"']").length > 0) {

		var circle = $(this).closest("div.visual-bbox-bar").find("circle[percentage='"+value+"']");

		circle.attr("x", -999);
		circle.attr("y", -999);
		circle.attr("w", 0);
		circle.attr("h", 0);

		circle.addClass("hidden");

	}	

	visualBboxSave();

	visualBboxDisplay();


});

$(document).on("click", ".visual-bbox-spot", function(){

	var value = $("#visual-video-timeline").val();

	if ($(this).closest("div.visual-bbox-bar").find("circle[percentage='"+value+"']").length > 0) {

		return false;

	}



	var value = parseFloat($("#visual-video-timeline").val());

	var percentage = value/100;

	var bar = $(this).closest("div.visual-bbox-bar").find("svg")[0];

	var position = $(this).closest("div.visual-bbox-bar").find("svg").outerWidth() * percentage;

	var index = $(this).closest("div.visual-bbox-bar").index();

	var x = $("#visual-video-canvas").outerWidth() / 2 - 50;
	var y = $("#visual-video-canvas").outerHeight() / 2 - 50;
	var w = 100;
	var h = 100;

	var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 2, fill: "black", percentage: value, x: x, y: y, w: w, h:h});
	bar.appendChild(path);



	var x = -999;
	var y = -999;
	var w = 0;
	var h = 0;

	var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 2, class: "hidden", fill: "black", percentage: value+0.1, x: x, y: y, w: w, h:h});
	bar.appendChild(path);


	var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 2, class: "hidden", fill: "black", percentage: value-0.1, x: x, y: y, w: w, h:h});
	bar.appendChild(path);


    var $wrapper = $(this).closest("div.visual-bbox-bar").find("svg"),
        $articles = $wrapper.find("circle");
    [].sort.call($articles, function(a,b) {
        return +parseFloat($(a).attr('percentage')) - +parseFloat($(b).attr('percentage'));
    });

    $articles.each(function(){
        $wrapper.append(this);
    });	

	visualBboxSave();
	visualBboxDisplay();


});

$(document).on("click", ".visual-bbox-insert", function(){


	var value = $("#visual-video-timeline").val();

	if ($(this).closest("div.visual-bbox-bar").find("circle[percentage='"+value+"']").length > 0) {

		return false;

	}



	var value = $("#visual-video-timeline").val();

	var percentage = value/100;

	var bar = $(this).closest("div.visual-bbox-bar").find("svg")[0];

	var position = $(this).closest("div.visual-bbox-bar").find("svg").outerWidth() * percentage;

	var index = $(this).closest("div.visual-bbox-bar").index();


	if ($(".visual-bbox-canvas-box-placeholder[index='"+index+"']").length > 0 && parseInt($(".visual-bbox-canvas-box-placeholder[index='"+index+"']").attr("x")) > 0) {

		var element = $(".visual-bbox-canvas-box-placeholder[index='"+index+"']");

		var x = parseInt(element.attr("x"));
		var y = parseInt(element.attr("y"));
		var w = parseInt(element.attr("width"));
		var h = parseInt(element.attr("height"));

	} else {

		var x = $("#visual-video-canvas").outerWidth() / 2 - 50;
		var y = $("#visual-video-canvas").outerHeight() / 2 - 50;
		var w = 100;
		var h = 100;

	}

	var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 2, fill: "black", percentage: value, x: x, y: y, w: w, h:h});
	bar.appendChild(path);


	// var canvas = $("#visual-video-canvas")[0];

	// var path = visualBboxInsertMakeSvg('rect', {x: 0, y: 0, w: 50, h:50, fill: "transparent", stroke: 'white', "stroke-width": 2});

	// canvas.appendChild(path);


    var $wrapper = $(this).closest("div.visual-bbox-bar").find("svg"),
        $articles = $wrapper.find("circle");
    [].sort.call($articles, function(a,b) {
        return +parseFloat($(a).attr('percentage')) - +parseFloat($(b).attr('percentage'));
    });

    $articles.each(function(){
        $wrapper.append(this);
    });


	visualBboxSave();

	visualBboxDisplay();




});

function visualBboxDisplay(){

	$("#visual-video-canvas>*").remove();

	$("div.visual-bbox-bar circle").removeClass("current");

	var value = $("#visual-video-timeline").val();

	$("div.visual-bbox-bar").each(function(){

		var index = $(this).index();

		var length = $(this).find("circle[percentage='"+value+"']").length;

		var canvas = $("#visual-video-canvas")[0];

		$(this).find("circle[percentage='"+value+"']").addClass("current");


		if (length > 0) {


			$(this).find("circle[percentage='"+value+"']").each(function(){



				var x = parseInt($(this).attr("x"));
				var y = parseInt($(this).attr("y"));
				var w = parseInt($(this).attr("w"));
				var h = parseInt($(this).attr("h"));


				var path = visualBboxInsertMakeSvg('rect', {x: x, y: y, width: w, height: h, fill: "transparent", stroke: 'white', "stroke-width": 2, class: "visual-bbox-canvas-box", index: index});		
				canvas.appendChild(path);

				var path = visualBboxInsertMakeSvg('rect', {x: x, y: y, width: 15, height: 15, fill: "white", class: "visual-bbox-canvas-box-move", index: index});
		        canvas.appendChild(path);

		        var right = x + w;
		        var bottom = y + h;

				var path = visualBboxInsertMakeSvg('polygon', {points: right+","+bottom+" "+(right-15)+","+bottom+" "+right+","+(bottom-15), fill: "white", class: "visual-bbox-canvas-box-resize", index: index});
		        canvas.appendChild(path);



			});

		} else {


			var start = null;
			var before = null;
			var end = null;

			$(this).find("circle[percentage]").each(function(){

				var percentage = parseFloat($(this).attr("percentage"));

				before = start;
				start = percentage;

				if (percentage > value) {

					end = percentage;
					start = before;
					return false;

				}


			});


			if (end != null) {

				console.log(value + " BETWEEN " + start + " AND " + end);

				var ratio = (value - start) / (end - start);

				var start = $(this).find("circle[percentage='"+start+"']");
				var end = $(this).find("circle[percentage='"+end+"']");

				startX = parseInt(start.attr("x"));
				endX = parseInt(end.attr("x"));

				var x = (startX) + (endX-startX) * ratio;

				startY = parseInt(start.attr("y"));
				endY = parseInt(end.attr("y"));

				var y = (startY) + (endY-startY) * ratio;

				startW = parseInt(start.attr("w"));
				endW = parseInt(end.attr("w"));

				var w = (startW) + (endW-startW) * ratio;

				startH = parseInt(start.attr("h"));
				endH = parseInt(end.attr("h"));

				var h = (startH) + (endH-startH) * ratio;

				var path = visualBboxInsertMakeSvg('rect', {x: x, y: y, width: w, height: h, fill: "transparent", stroke: 'white', "stroke-dasharray": "5,5", d: "M5 20 l215 0", "stroke-width": 2, class: "visual-bbox-canvas-box-placeholder", index: index});		
				canvas.appendChild(path);


			} else if (start != null) {

				console.log(value + " AFTER " + start + " WITH NO END");


				var start = $(this).find("circle[percentage='"+start+"']");
				startX = parseInt(start.attr("x"));
				startY = parseInt(start.attr("y"));
				startW = parseInt(start.attr("w"));
				startH = parseInt(start.attr("h"));

				var x = startX;
				var y = startY;
				var w = startW;
				var h = startH;

				var path = visualBboxInsertMakeSvg('rect', {x: x, y: y, width: w, height: h, fill: "transparent", stroke: 'white', "stroke-dasharray": "5,5", d: "M5 20 l215 0", "stroke-width": 2, class: "visual-bbox-canvas-box-placeholder", index: index});		
				canvas.appendChild(path);


			}


		}




	});



}

function visualBboxInsertMakeSvg(tag, attrs, text) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }


    if (text != undefined) {

	    el.innerHTML = text;

    }


    return el;
}



$(document).on("click", "div.visual-bbox-bar circle:not(.visual-bbox-cursor)", function(){

	var percentage = $(this).attr("percentage");

	$("#visual-video-timeline").val(percentage).trigger("input");

});




var load_control_index = false;
var load_control_active = null;
var load_control_mode = null;
var load_control_data = null;


$(document).on("mousedown", "#visual-video-canvas", function(e){

	load_control_active = true;
	load_control_index = $("polygon.visual-bbox-canvas-box-resize:hover, rect.visual-bbox-canvas-box-move:hover").attr("index");

	if ($("rect.visual-bbox-canvas-box-move:hover").length >= 1) {

		load_control_mode = "move";
		load_control_data = "bbox";

	} else if ($("polygon.visual-bbox-canvas-box-resize:hover").length >= 1) {

		load_control_mode = "resize";
		load_control_data = "bbox";

	}

	console.log(load_control_data+"-"+load_control_mode+"-"+load_control_index);


});


$(document).on("mouseup", "#visual-video-canvas", function(e){

	load_control_index = false;
	load_control_active = null;
	load_control_mode = null;
	load_control_data = null;

	visualBboxSave();


});


$(document).on("mousemove", "#visual-video-canvas", function(e){


	if (load_control_active == true && load_control_index != null && load_control_mode != null && load_control_data != null){

		var y = Math.abs(e.pageY - $("#visual-video-canvas").position().top);
		var x = Math.abs(e.pageX - $("#visual-video-canvas").position().left);


		var percentage = $("#visual-video-timeline").val();


		if (load_control_data == "bbox") {

			if (load_control_mode == "move") {

				var display = $("rect.visual-bbox-canvas-box[index='"+load_control_index+"']");
				display.attr("x", x-7.5);
				display.attr("y", y-7.5);

				var width = parseFloat(display.attr("width"));
				var height = parseFloat(display.attr("height"));
				var top = parseFloat(display.attr("y"));
				var left = parseFloat(display.attr("x"));

				$("rect.visual-bbox-canvas-box-move[index='"+load_control_index+"']").attr("x", left);
				$("rect.visual-bbox-canvas-box-move[index='"+load_control_index+"']").attr("y", top);

		        var right = left + width;
		        var bottom = top + height;

				$("polygon.visual-bbox-canvas-box-resize[index='"+load_control_index+"']").attr("points", right+","+bottom+" "+(right-15)+","+bottom+" "+right+","+(bottom-15));

				$("div.visual-bbox-bar:eq("+load_control_index+") circle[percentage='"+percentage+"']").attr("x", left).attr("y", top).attr("w", width).attr("h", height);

				console.log(left+":"+top+":"+right+":"+bottom);

			} else if (load_control_mode == "resize") {

				var display = $("rect.visual-bbox-canvas-box[index='"+load_control_index+"']");

				var top = parseFloat(display.attr("y"));
				var left = parseFloat(display.attr("x"));
				var width = Math.abs(left - x);
				var height = Math.abs(top - y);

				display.attr("width", width);
				display.attr("height", height);

				$("rect.visual-bbox-canvas-box-move[index='"+load_control_index+"']").attr("x", left);
				$("rect.visual-bbox-canvas-box-move[index='"+load_control_index+"']").attr("y", top);


		        var right = left + width;
		        var bottom = top + height;

				$("polygon.visual-bbox-canvas-box-resize[index='"+load_control_index+"']").attr("points", right+","+bottom+" "+(right-15)+","+bottom+" "+right+","+(bottom-15));

				console.log(left+":"+top+":"+right+":"+bottom);


				$("div.visual-bbox-bar:eq("+load_control_index+") circle[percentage='"+percentage+"']").attr("x", left).attr("y", top).attr("w", width).attr("h", height);

			}

		}

	}


});
