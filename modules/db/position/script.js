callback.cwcPosition = function(){
	
	var element = $("div[module='db/position']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		


}



$(document).on("mouseover", ".cwc_position_svg_top circle", function(){

	var id = $(this).attr("index");
	$(".cwc_position_svg_top circle[index='"+id+"']").addClass("active");


});


$(document).on("mouseout", ".cwc_position_svg_top circle", function(){

	var id = $(this).attr("index");
	$(".cwc_position_svg_top circle[index='"+id+"']").removeClass("active");


});

trigger.cwcPosition = function(){


	var stages = ["#cwc_position_svg_stage", "#cwc_position_svg_elevation"];

	var types = ["CHARACTER", "PROP", "CAMERA"];

	$.each(stages, function(j,name){

		$.each(types, function(i,o){

			var type = o;

			var cwcDataList = cwcData["ACTORS"][o];

			if (cwcDataList != undefined) {

				var cWidth = $(name).outerWidth();
				var cHeight = $(name).outerHeight();

				$(name+" circle[index][type='"+type+"']").each(function(){

					var id = $(this).attr("index");

					// console.log(id);

					if (cwcDataList[id] == undefined) {

						// console.log(id);

						console.log("NON:"+id);

						$(this).remove();
						$(name+" circle[index='"+id+"']").remove();
						$(name+" text[index='"+id+"']").remove();

					} else {


						if (id != cwc_position_index) {

							var x = cWidth * parseFloat(cwcDataList[id].X)/100;


							if (name == "#cwc_position_svg_elevation") {

								var zValue = parseFloat(cwcDataList[id].Z);

								if (zValue == 0) {

									var y = cHeight / 2;

								} else if (zValue > 0) {

									var y = (cHeight / 2) - (cHeight / 2) * (Math.abs(zValue) / 100);


								} else if (zValue < 0) {

									var y = (cHeight / 2) + (cHeight / 2) * (Math.abs(zValue) / 100);

								}



							} else {

								var y = cHeight * parseFloat(cwcDataList[id].Y)/100;

							}


							if (x != $(this).attr("cx") || y != $(this).attr("cy") || cwcDataList[id].ACTOR_NAME != $(name+" text[index='"+id+"'].label").text()) {

								$(this).attr("cx", x).attr("cy", y);
								$(name+" text[index='"+id+"']").attr("x", x).attr("y", y);
								$(name+" text[index='"+id+"'] tspan").attr("x", x);
								$(name+" text[index='"+id+"'].label").text(cwcDataList[id].ACTOR_NAME);
								

							}



						}


					}

				});


				$.each(cwcDataList, function(i,o){


					if ($(name+" circle[index='"+o.ACTOR_ID+"']").length == 0) {

						var x = cWidth * parseFloat(o.X)/100;

						if (name == "#cwc_position_svg_elevation") {

							var zValue = parseFloat(o.Z);

							if (zValue == 0) {

								var y = cHeight / 2;

							} else if (zValue > 0) {

								var y = (cHeight / 2) - (cHeight / 2) * (Math.abs(zValue) / 100);


							} else if (zValue < 0) {

								var y = (cHeight / 2) + (cHeight / 2) * (Math.abs(zValue) / 100);

							}


						} else {

							var y = cHeight * parseFloat(o.Y)/100;

						}



						var circle = cwcGraphMakeSVG("circle", {cx: x, cy: y, "stroke-width": 1, "stroke": "#000", index: o.ACTOR_ID, type: type});

						var canvas = $(name)[0];

						canvas.appendChild(circle);

						// if (name != "#cwc_position_svg_elevation") {

							var text = cwcGraphMakeSVG("text", {x: x, y: y, index: o.ACTOR_ID, class: "label"}, o.ACTOR_NAME);
							canvas.appendChild(text);

						// }

						var icon = "";

						if (type == "CHARACTER") {

							icon = "&#xf007;";

						} else if (type == "ACTION") {

							icon = "&#xf554;";

						} else if (type == "POSITION") {

							icon = "&#xf3c5;";

						} else if (type == "CAMERA") {

							icon = "&#xf03d;";


						} else {


							icon = "&#xf1bb;";

						}

						var text = cwcGraphMakeSVG("text", {x: x, y: y, index: o.ACTOR_ID, class: "fa icon"}, icon);
						canvas.appendChild(text);


						var text = cwcGraphMakeSVG("text", {x: x, y: y, index: o.ACTOR_ID, class: "attr"});

						canvas.appendChild(text);


					}

				});


			}
			


		});





	});




}



var cwc_position_active = true;
var cwc_position_index = null;
var cwc_position_id = null;

$(document).on("mousedown", ".cwc_position_svg_top", function(e){

	cwc_position_id = $(this).attr("id");
	cwc_position_active = true;
	cwc_position_index = $(".cwc_position_svg_top circle:hover").attr("index");

	console.log(cwc_position_active);
	console.log(cwc_position_index);
	console.log(cwc_position_id);

	$("#cwc_listener_log").attr("writing", "true");

});

$(document).on("dblclick", "#cwc_position_svg_elevation circle", function(e){

	var cWidth = $(".cwc_position_svg_top").outerWidth();
	var cHeight = $(".cwc_position_svg_top").outerHeight();

	var index = $(this).attr("index");

	var x = $("#cwc_position_svg_elevation circle[index='"+index+"']").attr("cx");
	var px = parseFloat(x) / cWidth * 100;

	$("#cwc_listener_log").attr("writing", "true");

	$.ajax({
		url: "/modules/db/position/push.php",
		type: "POST",
		data: {
			id: index,
			x: px,
			z: 0
		},
		success: function(data){

			$("#cwc_listener_log").removeAttr("writing");

			var y = (cHeight/2)+"px";

			$("#cwc_position_svg_elevation circle[index='"+index+"']").attr("cy", y);
			$("#cwc_position_svg_elevation text[index='"+index+"']").attr("x", x).attr("y", y);
			$("#cwc_position_svg_elevation text[index='"+index+"'] tspan").attr("x", x);
		}
	});		

});


$(document).on("mouseup", ".cwc_position_svg_top", function(e){

	if (cwc_position_active == true && cwc_position_index != null && cwc_position_id != null){

		var cWidth = $(".cwc_position_svg_top").outerWidth();
		var cHeight = $(".cwc_position_svg_top").outerHeight();

		var x = $("#"+cwc_position_id+".cwc_position_svg_top circle[index='"+cwc_position_index+"']").attr("cx");


		if (cwc_position_id == "cwc_position_svg_elevation") {



			var y = $("#"+cwc_position_id+".cwc_position_svg_top circle[index='"+cwc_position_index+"']").attr("cy");
			var percentage = y / cHeight;


			if (percentage == 0.5) {

				var z = 0;

			} else if (percentage < 0.5) {

				var z = 100 - (100*2*percentage);

			} else if (percentage > 0.5) {

				var z = -100 + (100*2*(1-percentage));

			}

			var px = parseFloat(x) / cWidth * 100;
			var py = parseFloat(y) / cHeight * 100;


			$.ajax({
				url: "/modules/db/position/push.php",
				type: "POST",
				data: {
					id: cwc_position_index,
					x: px,
					z: z
				},
				success: function(data){

					$("#cwc_listener_log").removeAttr("writing");


				}
			});		


		} else {

			var y = $("#"+cwc_position_id+".cwc_position_svg_top circle[index='"+cwc_position_index+"']").attr("cy");

			var px = parseFloat(x) / cWidth * 100;
			var py = parseFloat(y) / cHeight * 100;


			$.ajax({
				url: "/modules/db/position/push.php",
				type: "POST",
				data: {
					id: cwc_position_index,
					x: px,
					y: py
				},
				success: function(data){

					$("#cwc_listener_log").removeAttr("writing");


				}
			});		

		}





	}

	cwc_position_active = false;
	cwc_position_index = null;
	cwc_position_id = null;

	$(".cwc_position_svg_top circle.active").removeClass("active");

	console.log(cwc_position_active);
	console.log(cwc_position_index);
	console.log(cwc_position_id);

});



$(document).on("mousemove", ".cwc_position_svg_top", function(e){


	if (cwc_position_active == true && cwc_position_index != null && cwc_position_id != null){

		$("#"+cwc_position_id+".cwc_position_svg_top circle[index='"+cwc_position_index+"']").addClass("active");

		var y = Math.abs(e.pageY - $("#"+cwc_position_id+".cwc_position_svg_top").position().top);
		var x = Math.abs(e.pageX - $("#"+cwc_position_id+".cwc_position_svg_top").position().left);

		$("#"+cwc_position_id+".cwc_position_svg_top circle[index='"+cwc_position_index+"']").attr("cx", x);
		$("#"+cwc_position_id+".cwc_position_svg_top circle[index='"+cwc_position_index+"']").attr("cy", y);
		$("#"+cwc_position_id+".cwc_position_svg_top text[index='"+cwc_position_index+"']").attr("x", x).attr("y", y);
		$("#"+cwc_position_id+".cwc_position_svg_top text[index='"+cwc_position_index+"'] tspan").attr("x", x);

	}


});


$(document).on("click", "#cwc_position_svg_toggle a", function(e){

	e.preventDefault();

	var div = $(this).attr("display");

	$("#"+div).fadeTo("fast", 1).css("z-index", 1);
	$("#"+div).siblings("div").fadeTo("fast", 0).css("z-index", 0);

	$(this).addClass("active");
	$(this).parent().siblings().find("a").removeClass("active");

});
