var annotateAssetIndex = 0;
var annotateAssetColors = ["E6194B", "3CB44B", "FFE119", "4363D8", "F58231", "911EB4", "42D4F4", "F032E6", "BFEF45", "FABEBE", "469990", "E6BEFF", "9A6324", "FFFAC8", "800000", "AAFFC3", "808000", "FFD8B1", "000075", "A9A9A9", "FFFFFF", "000000"];

function annotateAssetResize(){

	var element = $("div[module='annotate/asset']");
	element.css("height", "auto");
	var height = element.outerHeight();

	element.css("height", height+"px");

}

function annotateAssetMakeSVG(tag, attrs, text) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {

    	// if (isNaN(attrs[k]) == false) {

	        el.setAttribute(k, attrs[k]);

    	// }

    }

    if (text != undefined) {
	    el.innerHTML = text;
    }

    return el;
}

callback.annotateAsset = function(){

	$.ajax({
		url: "/modules/annotate/asset/load.php",
		type: "GET",
		data: {
			session: session_id
		},
		success: function(data){

			var data = JSON.parse(data);

			$.each(data, function(i,o){


				var clone = $("#annotate_asset_list div.template").clone();

				clone.removeClass("d-none").removeClass("template").addClass("annotate_asset_item");
				clone.find("span[name='ACTOR_ID']").text(o.ACTOR_ID);
				clone.find("span[name='ACTOR_NAME']").text(o.ACTOR_NAME);
				clone.attr("db", o.ACTOR_ID);

				if (o.ACTOR_NAME == "CAMERA") {

					clone.find(".annotate_asset_remove").remove();
					clone.find(".annotate_asset_rename").remove();
					clone.find(".annotate_asset_bbox_hide").remove();
					clone.find(".annotate_asset_bbox").remove();
					clone.find(".annotate_asset_shortcut").remove();


				} else {

					clone.find("span[name='ACTOR_ID']").before("<i class='fa fa-circle mr-2' style='color: #"+annotateAssetColors[annotateAssetIndex]+"'></i>");

					clone.find("span[name='ACTOR_KEY']").text(annotateAssetIndex+1);


					var group = clone.find(".annotate_asset_bbox_svg g")[0];

					$.each(o.BBOX, function(time,p){

						console.log(p);

						var x = ((time - 1) / (annotateVideoFrames - 1) * 100)+"%";
						var y = "50%";

						var circle = annotateAssetMakeSVG("circle", {cx: x, cy: y, fill: "black", "stroke-width": 0, "stroke": "transparent", r: 1, time: time, class: 'annotate_asset_bbox_dot', overlay: p[0].OVERLAY_ID, o0_id: p[0].OVERLAY_POINT_ID, o0_x: p[0].X, o0_y: p[0].Y, o1_id: p[1].OVERLAY_POINT_ID, o1_x: p[1].X, o1_y: p[1].Y, colorIndex: annotateAssetIndex, actor: o.ACTOR_ID});
						group.appendChild(circle);

					});

					annotateAssetIndex++;

				}


				var group = clone.find(".annotate_asset_graph_svg g")[0];

				$.each(o.GRAPH, function(time,p){

					var x = ((time - 1) / (annotateVideoFrames - 1) * 100)+"%";
					var y = "50%";

					var circle = annotateAssetMakeSVG("circle", {cx: x, cy: y, fill: "black", "stroke-width": 0, "stroke": "transparent", r: 1, time: time, class: 'annotate_asset_graph_dot', x: p.X, y: p.Y, rotate: p.RZ, frame: p.FRAME_ID, actor: o.ACTOR_ID});


					group.appendChild(circle);

				});

				$("#annotate_asset_list").append(clone);


			});




		}
	});

	annotateAssetResize();

}

$(document).on("click", "#annotate_asset_add", function(){

	var response = prompt("What's the name of the actor?");

	if (response != null) {

		response = response.trim();

		$.ajax({
			url: "/modules/annotate/asset/add.php",
			type: "POST",
			data: {
				session: session_id,
				name: response
			},
			success: function(data){



				window.location.reload();

			}
		});

	}

});


$(document).on("click", ".annotate_asset_remove", function(){

	var response = confirm("Are you sure you want to remove this actor?");

	if (response == true) {

		var id = $(this).closest(".annotate_asset_item").attr("db");

		$.ajax({
			url: "/modules/annotate/asset/remove.php",
			type: "POST",
			data: {
				session: session_id,
				actor_id: id
			},
			success: function(data){

				window.location.reload();

			}
		});

	}

});

window.onbeforeunload = function() {

	$(".annotate_graph_stage_dot").each(function(){

		annotateGraphActive = $(this).attr("actor");
		$(this).trigger("mouseup");

	});

}


$(document).on("click", ".annotate_asset_rename", function(){

	var actorName = $(this).closest(".annotate_asset_item").find("span[name='ACTOR_NAME']");
	var name = actorName.text();

	var response = prompt("What's the new name?", name);

	if (response != null) {

		var id = $(this).closest(".annotate_asset_item").attr("db");

		response = response.trim();

		var obj = {
				session: session_id,
				name: response,
				actor_id: id
			};

		$.ajax({
			url: "/modules/annotate/asset/rename.php",
			type: "POST",
			data: obj,
			success: function(data){

				actorName.text(response);
				annotateLogInsert("<i class='fa fa-times'></i> Actor Name.", obj);

			}
		});

	}

});


var annotateAssetRemove = false;

$(window).on("keydown", function(e){


	if (e.which == 16) {

		annotateAssetRemove = true;
	}

});

$(window).on("keyup", function(e){


	console.log(e.which);


	if (e.which == 80) {

		if (annotateVideoPlayer != undefined && annotateVideoPlayer != null) {

			if (annotateVideoPlayer.paused != true) {

				annotateVideoPlayer.pause();

			} else {

				annotateVideoPlayer.play();

			}


		}



	} else if (e.which == 67) {

		if ($("#annotate_asset_list svg.annotate_asset_graph_svg:hover circle[fill='red']").length > 0) {

			var response = prompt("Which frame would you like to copy this keyframe to?");

			if (response != null && Number.isInteger(parseInt(response)) == true){

				if ($("#annotate_asset_list svg.annotate_asset_graph_svg:hover circle[time='"+response+"']").length > 0) {

					alert("This frame is occupied. Please remove the existing keyframe and try again.");
					return false;

				} else {

					// alert("TEST");

					var clone = $("#annotate_asset_list svg.annotate_asset_graph_svg:hover circle[fill='red']").clone();
					clone.attr("fill", "black");
					clone.attr("time", response);
					clone.removeAttr("frame");
					var x = ((parseInt(response) - 1) / (annotateVideoFrames - 1) * 100)+"%";
					clone.attr("cx", x);

					$("#annotate_asset_list svg.annotate_asset_graph_svg:hover circle[fill='red']").after(clone);

					var actor = clone.attr("actor");
					var x = clone.attr("x");
					var y = clone.attr("y");
					var rotate = clone.attr("rotate");

					var obj = {
						time: response,
						actor: actor,
						x: x,
						y: y,
						rz: rotate
					};

					$.ajax({
						url: "/modules/annotate/graph/insert_frame.php",
						type: "POST",
						data: obj,
						success: function(data){

							annotateLogInsert("<i class='fa fa-plus'></i> Graph Annotation.", obj);

							var data = data.trim();

							clone.attr("frame", data);


						}
					});		


				}


			}


		}

	} else if (e.which >= 49 && e.which <= 57) {


		var index = e.which - 48;

		if ($(".annotate_asset_item:eq("+index+")").length > 0) {

			var item = $(".annotate_asset_item:eq("+index+")");

			var id = item.attr("db");
			var time = annotateVideoCurrentFrame;

			var x1 = null;
			var y1 = null;
			var x2 = null;
			var y2 = null;

			for (var i = time; i > 0; i--) {

				console.log(i);

				if (item.find(".annotate_asset_bbox_dot[time='"+i+"']").length > 0) {


					x1 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o0_x");
					y1 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o0_y");

					x2 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o1_x");
					y2 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o1_y");


					break;

				}

			}

			if (x1 == null) {


				for (var i = 0; i < annotateVideoFrames; i++) {

					console.log(i);

					if (item.find(".annotate_asset_bbox_dot[time='"+i+"']").length > 0) {


						x1 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o0_x");
						y1 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o0_y");

						x2 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o1_x");
						y2 = item.find(".annotate_asset_bbox_dot[time='"+i+"']").attr("o1_y");


						break;

					}

				}



			}


			var obj = {
					time: time,
					actor_id: id,
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
				};

			$.ajax({
				url: "/modules/annotate/asset/new_bbox.php",
				type: "POST",
				data: obj,
				success: function(data){


					var data = JSON.parse(data);

					if (data.overlay != undefined) {


						var group = item.find(".annotate_asset_bbox_svg g")[0];

						var x = ((time - 1) / (annotateVideoFrames - 1) * 100)+"%";
						var y = "50%";


						var circle = annotateAssetMakeSVG("circle", {cx: x, cy: y, fill: "red", "stroke-width": 0, "stroke": "transparent", r: 1, time: time, class: 'annotate_asset_bbox_dot', overlay: data.overlay, o0_id: data.point_0.id, o0_x: data.point_0.x, o0_y: data.point_0.y, o1_id: data.point_1.id, o1_x: data.point_1.x, o1_y: data.point_1.y, colorIndex: item.index(".annotate_asset_item")-1, actor: id});
						group.appendChild(circle);


						annotateVideoMove();

						annotateLogInsert("<i class='fa fa-plus'></i> Bbox Annotation.", obj);

					}


				}
			});




		}


	} else if (e.which == 37) {

		$("#annotate_video_slider").blur();
		$("#annotate_video_slider").val(parseInt(annotateVideoCurrentFrame)-1).trigger("input");

	} else if (e.which == 39) {

		$("#annotate_video_slider").blur();
		$("#annotate_video_slider").val(parseInt(annotateVideoCurrentFrame)+1).trigger("input");
	
	} else if (e.which == 219) {

		$("#annotate_video_slider").blur();
		$("#annotate_video_slider").val(1).trigger("input");
	
	} else if (e.which == 221) {


		$("#annotate_video_slider").blur();
		$("#annotate_video_slider").val(annotateVideoFrames).trigger("input");
	

	} else if (e.which == 16) {

		annotateAssetRemove = false;

	} else if (e.which == 74) {

		$("#annotate_asset_list svg").each(function(){

			var parent = $(this).find("g");

			parent.find("circle").sort(function(a, b){
			    return +$(a).attr('time') - +$(b).attr('time');
			}).appendTo(parent);
		    

		});


		if ($("#annotate_asset_list svg:hover").length > 0) {

			if ($("#annotate_asset_list svg:hover circle[fill='red']").length > 0) {

				$("#annotate_asset_list svg:hover circle[fill='red']").prev("circle").click();

			} else {


				for (var i = annotateVideoCurrentFrame; i >= 1; i--) {

					if ($("#annotate_asset_list svg:hover circle[time='"+i+"']").length > 0) {

						$("#annotate_asset_list svg:hover circle[time='"+i+"']").click();
						break;

					}

				}


			}


		} else {


			for (var i = annotateVideoCurrentFrame-1; i >= 1; i--) {

				if ($("#annotate_asset_list circle[time='"+i+"']").length > 0) {

					$("#annotate_asset_list circle[time='"+i+"']:first").click();
					break;

				}

			}			

		}



	} else if (e.which == 75) {

		$("#annotate_asset_list svg").each(function(){

			var parent = $(this).find("g");

			parent.find("circle").sort(function(a, b){
			    return +$(a).attr('time') - +$(b).attr('time');
			}).appendTo(parent);
		    

		});
		    


		if ($("#annotate_asset_list svg:hover").length > 0) {


			if ($("#annotate_asset_list svg:hover circle[fill='red']").length > 0) {

				$("#annotate_asset_list svg:hover circle[fill='red']").next("circle").click();

			} else {

				for (var i = annotateVideoCurrentFrame; i <= parseInt(annotateVideoFrames); i++) {


					if ($("#annotate_asset_list svg:hover circle[time='"+i+"']").length > 0) {

						$("#annotate_asset_list svg:hover circle[time='"+i+"']").click();
						break;

					}

				}


			}

		} else {


			for (var i = parseInt(annotateVideoCurrentFrame)+1; i <= parseInt(annotateVideoFrames); i++) {

				if ($("#annotate_asset_list circle[time='"+i+"']").length > 0) {

					$("#annotate_asset_list circle[time='"+i+"']:first").click();
					break;

				}

			}			

		}


	} else if (e.which == 46 || e.which == 8) {

		if ($("#annotate_asset_list svg:hover circle[fill='red']").length > 0) {

			annotateAssetRemove = true;
			$("#annotate_asset_list svg:hover circle[fill='red']").trigger("dblclick");
			annotateAssetRemove = false;
		}

	}

	// alert(e.which);

});




$(document).on("click", ".annotate_asset_bbox_dot, .annotate_asset_graph_dot", function(e){

	e.stopPropagation();

	var value = $(this).attr("time");

	$("#annotate_video_slider").val(parseInt(value)).trigger("input");

});



$(document).on("dblclick", ".annotate_asset_bbox_dot[fill='red']", function(e){

	e.preventDefault();

	if (annotateAssetRemove == true) {

		$(this).remove();
		annotateVideoPaint();

		var obj = {
			db: $(this).attr("overlay")
		}



		$.ajax({
			url: "/modules/annotate/asset/remove_bbox.php",
			type: "POST",
			data: obj,
			success: function(data){

				annotateLogInsert("<i class='fa fa-times'></i> Bbox Annotation.", obj);

			}
		});


	}




});


$(document).on("dblclick", ".annotate_asset_graph_dot[fill='red']", function(e){

	e.preventDefault();

	if (annotateAssetRemove == true) {

		$(this).remove();
		annotateVideoPaint();



		var obj = {
			db: $(this).attr("frame")
		}


		$.ajax({
			url: "/modules/annotate/asset/remove_frame.php",
			type: "POST",
			data: obj,
			success: function(data){

				annotateLogInsert("<i class='fa fa-times'></i> Graph Annotation.", obj);

			}
		});


	}




});


// $(document).on("mousedown", ".annotate_asset_bbox_svg, .annotate_asset_graph_svg", function(){

// 	$("html, body").addClass("annotateGraphActive");


// });



// $(document).on("mouseup", ".annotate_asset_bbox_svg, .annotate_asset_graph_svg", function(){

// 	$("html, body").addClass("annotateGraphActive");



// });

$(document).on("click", ".annotate_asset_bbox_svg, .annotate_asset_graph_svg", function(e){

	var x = (e.offsetX / $(this).outerWidth());

	var frame = Math.round((parseInt(annotateVideoFrames)+1)*x);

    var obj = {
    	x: x,
    	frame: frame
    }


	annotateLogInsert("Scrubbing timeline.", obj);

	$("#annotate_video_slider").val(frame).trigger("input");

});

// $(document).on("mousewheel", ".annotate_asset_bbox_svg, .annotate_asset_graph_svg", function(e){


//     var obj = {
//     	data: e.originalEvent.wheelDelta
//     }

// 	annotateLogInsert("Scrubbing timeline.", obj);

// 	// var wheelOffset = Math.round(e.originalEvent.wheelDelta)*0.01;


// 	if (e.originalEvent.wheelDelta > 0) {

// 		var wheelOffset = 1;

// 	} else {

// 		var wheelOffset = -1;

// 	}

// 	$("#annotate_video_slider").blur();
// 	$("#annotate_video_slider").val(parseInt(annotateVideoCurrentFrame)+wheelOffset).trigger("input");


// });

