function annotateGraphPlace(){

	var group = $("#annotate_graph_stage")[0];

	$("#annotate_asset_list .annotate_asset_item").each(function(){

		var x = "50%";
		var y = "50%";

		var colorIndex = $(this).index(".annotate_asset_item")-1;

		var db = $(this).attr("db");

		if (colorIndex == -1) {

			var color = "black";

		} else {

			var color = "#"+annotateAssetColors[colorIndex];

		}

		var rect = annotateAssetMakeSVG("rect", {x: "50%", y: "50%", width:"5%", height:"5%", fill: "white", "stroke-width": 1, "stroke": "black", class: 'annotate_graph_stage_view', actor: db, rotate: 0});
		group.appendChild(rect);

		$(".annotate_graph_stage_view[actor='"+db+"']").css("transform-origin", ""+50+"% "+50+"%");


		var circle = annotateAssetMakeSVG("circle", {cx: x, cy: y, fill: color, "stroke-width": 0, "stroke": "transparent", r: "4%", class: 'annotate_graph_stage_dot', actor: db});
		group.appendChild(circle);



	});

}


$(document).on("touchmove", "#annotate_graph_svg", function(e){

	console.log(e);


});

$(document).on("mousewheel", ".annotate_graph_stage_dot", function(e){

	if (annotateGraphActive != null) {

	    var actor = $(this).attr("actor");

		var rotate = parseFloat($(".annotate_graph_stage_view[actor='"+actor+"']").attr("rotate"));
	    rotate -= e.originalEvent.wheelDelta*0.01;

	    if (rotate < 0) {

	    	rotate = 360;

	    }


	    if (rotate > 360) {

	    	rotate = 0;

	    }


	    $(".annotate_graph_stage_view[actor='"+actor+"']").css("transform", "rotate("+rotate+"deg)");
	    $(".annotate_graph_stage_view[actor='"+actor+"']").attr("rotate", rotate);


		var time = annotateVideoCurrentFrame;

		var item = $(".annotate_asset_item[db='"+actor+"']");

		$(".annotate_graph_stage_dot[actor='"+actor+"']").fadeTo(0, 0.5);

	}


});


var annotateGraphActive = null;


$(document).on("mousedown", ".annotate_graph_stage_dot", function(){

	annotateGraphActive = $(this).attr("actor");

	$("html, body").addClass("annotateGraphActive");



});


$(document).on("mouseup", ".annotate_graph_stage_dot", function(e){


	var time = annotateVideoCurrentFrame;

	var item = $(".annotate_asset_item[db='"+annotateGraphActive+"']");
	$(".annotate_graph_stage_dot[actor='"+annotateGraphActive+"']").fadeTo(0, 1);

	var curY = $(".annotate_graph_stage_dot[actor='"+annotateGraphActive+"']").attr("cy").replace("%", "");
	var curX = $(".annotate_graph_stage_dot[actor='"+annotateGraphActive+"']").attr("cx").replace("%", "");
	var rotate = $(".annotate_graph_stage_view[actor='"+annotateGraphActive+"']").attr("rotate");


	if (item.find(".annotate_asset_graph_svg g .annotate_asset_graph_dot[time='"+time+"']").length == 0) {

		var group = item.find(".annotate_asset_graph_svg g")[0];

		var x = ((time - 1) / (annotateVideoFrames - 1) * 100)+"%";
		var y = "50%";

		var circle = annotateAssetMakeSVG("circle", {cx: x, cy: y, fill: "red", "stroke-width": 0, "stroke": "transparent", r: 1, time: time, class: 'annotate_asset_graph_dot', x: curX, y: curY, rotate: rotate, actor: annotateGraphActive});
		group.appendChild(circle);
		 

		var obj = {
			time: time,
			actor: annotateGraphActive,
			x: curX,
			y: curY,
			rz: rotate
		};

		$.ajax({
			url: "/modules/annotate/graph/insert_frame.php",
			type: "POST",
			data: obj,
			success: function(data){

				annotateLogInsert("<i class='fa fa-plus'></i> Graph Annotation.", obj);

				var data = data.trim();
				item.find(".annotate_asset_graph_svg g .annotate_asset_graph_dot[time='"+time+"']").attr("frame", data);


			}
		});		 

	} else {

		item.find(".annotate_asset_graph_svg g .annotate_asset_graph_dot[time='"+time+"']").attr("x", curX);
		item.find(".annotate_asset_graph_svg g .annotate_asset_graph_dot[time='"+time+"']").attr("y", curY);
		item.find(".annotate_asset_graph_svg g .annotate_asset_graph_dot[time='"+time+"']").attr("rotate", rotate);


		var obj = {};
		obj.time = time
		obj.actor = annotateGraphActive
		obj.x = curX
		obj.y = curY
		obj.rz = rotate;


		$.ajax({
			url: "/modules/annotate/graph/update_frame.php",
			type: "POST",
			data: obj,
			success: function(data){

				annotateLogInsert("<i class='fa fa-pencil-alt'></i> Graph Annotation.", obj);
			

			}
		});

	}



	annotateGraphActive = null;

	$("html, body").removeClass("annotateGraphActive");

});


$(document).on("mousemove", "#annotate_graph_svg", function(e){


	if (annotateGraphActive != null) {


		var curY = (e.pageY - $("#annotate_graph_svg").position().top) / $("#annotate_graph_svg").outerHeight() * 100;
		var curX = (e.pageX - $("#annotate_graph_svg").position().left) / $("#annotate_graph_svg").outerWidth() * 100;


		$(".annotate_graph_stage_dot[actor='"+annotateGraphActive+"']").attr("cx", curX+"%");
		$(".annotate_graph_stage_dot[actor='"+annotateGraphActive+"']").attr("cy", curY+"%");

		$(".annotate_graph_stage_view[actor='"+annotateGraphActive+"']").attr("x", curX+"%");
		$(".annotate_graph_stage_view[actor='"+annotateGraphActive+"']").attr("y", curY+"%");
		$(".annotate_graph_stage_view[actor='"+annotateGraphActive+"']").css("transform-origin", ""+curX+"% "+curY+"%");




	}


});


$(document).on("click", "#annotate_graph_expand", function(e){

	$("div[module='annotate/graph']").parent().toggleClass("col-12");


	var element = $("div[module='annotate/graph']");
	element.css("height", "auto");
	var height = element.outerHeight();

	element.css("height", height+"px");

	$("div[module='annotate/asset']").parent().toggleClass("col-12");


	annotateAssetResize();

});
