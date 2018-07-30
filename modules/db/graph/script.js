callback.cwcGraph = function(){
	
	var element = $("div[module='cwc/graph']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");			

}



function cwcGraphMakeSVG(tag, attrs, text) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }

    if (text != undefined) {
	    el.innerHTML = text;
    }

    return el;
}

$(document).on("click", "#cwc_graph_svg_toggle a", function(e){

	e.preventDefault();

	var div = $(this).attr("display");

	$("#"+div).fadeTo("fast", 1).css("z-index", 1);
	$("#"+div).siblings("div").fadeTo("fast", 0).css("z-index", 0);

	$(this).addClass("active");
	$(this).parent().siblings().find("a").removeClass("active");

});


trigger.cwcGraph = function(){


	var stages = ["#cwc_graph_svg_conceptual", "#cwc_graph_svg_stage", "#cwc_graph_svg_elevation"];


	$.each(stages, function(j,name){

		if (name == "#cwc_graph_svg_conceptual") {

			var types = ["CHARACTER", "PROP", "ACTION", "POSITION", "CAMERA"];

		} else {

			var types = ["CHARACTER", "PROP", "CAMERA"];

		}




		$.each(types, function(i,o){

			var type = o;

			var cwcDataList = cwcData["ACTORS"][o];



			if (cwcDataList != undefined) {

				var cWidth = $(name).outerWidth();
				var cHeight = $(name).outerHeight();

				$(name+" circle[index][type='"+type+"']").each(function(){

					var id = $(this).attr("index");


					if (cwcDataList[id] == undefined) {

						$(this).remove();
						$(name+" *[index='"+id+"']").remove();

					} else {


						if (id != cwc_graph_index) {

							var x = cWidth * parseFloat(cwcDataList[id].X)/100;


							if (name == "#cwc_graph_svg_elevation") {

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

							// console.log(cwcDataList[id].ACTOR_NAME+"-"+$(name+" text[index='"+id+"'].label").text());

							if (cwcDataList[id].ACTOR_NAME == null) {

								cwcDataList[id].ACTOR_NAME = "";

							}

							if (cwcDataList[id].SELECTED == null) {

								cwcDataList[id].SELECTED = 0;

							}


							if (x != $(this).attr("cx") || y != $(this).attr("cy") || id+": "+cwcDataList[id].ACTOR_NAME != $(name+" text[index='"+id+"'].label").text() || cwcDataList[id].SELECTED != $(this).attr("active")) {

								$(this).attr("cx", x).attr("cy", y);
								$(name+" rect[index='"+id+"']").attr("x", x-15).attr("y", y-15);								
								$(name+" text[index='"+id+"']").attr("x", x).attr("y", y);
								$(name+" text[index='"+id+"'] tspan").attr("x", x);
								$(name+" text[index='"+id+"'].label").text(id+": "+cwcDataList[id].ACTOR_NAME);
								
								$(this).attr("cx", x).attr("active", cwcDataList[id].SELECTED);
								$(name+" rect[index='"+id+"']").attr("active", cwcDataList[id].SELECTED);


								if ($(name+" line[index='"+id+"']").length > 0) {

									var rz = $(name+" line[index='"+id+"']").attr("rotation");


									var radian = (parseFloat(rz) + 90) * Math.PI / 180;
									var ax = x + 30 * Math.cos(radian);
									var ay = y + 30 * Math.sin(radian);		

									$("#cwc_graph_svg_stage line[index='"+id+"']").attr("x1", x);
									$("#cwc_graph_svg_stage line[index='"+id+"']").attr("y1", y);
									$("#cwc_graph_svg_stage line[index='"+id+"']").attr("x2", ax);
									$("#cwc_graph_svg_stage line[index='"+id+"']").attr("y2", ay);

								}



							}



							if (name == "#cwc_graph_svg_conceptual") {


								$(name+" text[index='"+id+"'].attr tspan").remove();

								var text = $(name+" text[index='"+id+"'].attr")[0];

								$(name+" text[index='"+id+"'].attr tspan").remove();


								var attributes = "Elevation: "+cwcDataList[id].Z;
								var tline = cwcGraphMakeSVG("tspan", {x: x, dy: "1.3em", index: id}, attributes);
								text.appendChild(tline);

								var attributes = "Orientation: "+cwcDataList[id].RZ;
								var tline = cwcGraphMakeSVG("tspan", {x: x, dy: "1.3em", index: id}, attributes);


								text.appendChild(tline);


								if (cwcData["ATTRIBUTES"][id] != undefined) {


										var attributes = "Attributes: "+Object.keys(cwcData["ATTRIBUTES"][id]).length;
										var tline = cwcGraphMakeSVG("tspan", {x: x, dy: "1.3em", index: id}, attributes);

										text.appendChild(tline);


									// $.each(cwcData["ATTRIBUTES"][id], function(i,o){

									// 	var attributes = o["LABEL"]+": "+o["VALUE"]+" ("+o["ATTRIBUTE_TYPE_NAME"]+")";
									// 	var tline = cwcGraphMakeSVG("tspan", {x: x, dy: "1.3em", index: o.ATTRIBUTE_ID}, attributes);

									// 	text.appendChild(tline);

									// });

								} else {

									
								}


							}




						}


					}

				});


				$.each(cwcDataList, function(i,o){


					if ($(name+" circle[index='"+o.ACTOR_ID+"']").length == 0) {

						var x = cWidth * parseFloat(o.X)/100;

						if (name == "#cwc_graph_svg_elevation") {

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


						if (o.SELECTED == null) {

							o.SELECTED = 0;

						}


						var canvas = $(name)[0];

						if (type == "ACTION" || type == "POSITION") {

							var rect = cwcGraphMakeSVG("rect", {x: x-15, y: y-15, width: 30, height: 30, "stroke-width": 1, "stroke": "#000", index: o.ACTOR_ID, type: type, active: o.SELECTED});
							canvas.appendChild(rect);			

							var circle = cwcGraphMakeSVG("circle", {cx: x, cy: y, fill: "transparent", "stroke-width": 0, "stroke": "#000", index: o.ACTOR_ID, type: type, active: o.SELECTED});
							canvas.appendChild(circle);



						} else {

							if (name == "#cwc_graph_svg_stage") {

								var radian = (parseFloat(o.RZ) + 90) * Math.PI / 180;
								var ax = x + 30 * Math.cos(radian);
								var ay = y + 30 * Math.sin(radian);

								var angle = cwcGraphMakeSVG("line", {x1: x, y1: y, x2: ax, y2: ay, "stroke-width": 5, "stroke": "#000", index: o.ACTOR_ID, type: type, rotation: o.RZ});
								canvas.appendChild(angle);

							}

							var circle = cwcGraphMakeSVG("circle", {cx: x, cy: y, "stroke-width": 1, "stroke": "#000", index: o.ACTOR_ID, type: type, active: o.SELECTED});
							canvas.appendChild(circle);



						}







						if (name == "#cwc_graph_svg_conceptual") {

							var text = cwcGraphMakeSVG("text", {x: x, y: y, index: o.ACTOR_ID, class: "label"}, o.ACTOR_NAME);
							canvas.appendChild(text);

						}


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

				if (name == "#cwc_graph_svg_conceptual") {

					$(name+" polyline[index]").each(function(){

						var id = $(this).attr("index");

						if (cwcData.INTERACTIONS[id] == undefined) {

							$(this).remove();

						} else {

							var o = cwcData.INTERACTIONS[id];

							if (o.ACTOR_ID_0 != "0" && o.ACTOR_ID_1 != "0" && o.ACTOR_ID_0 != "" && o.ACTOR_ID_1 != "" && o.ACTOR_ID_0 != null && o.ACTOR_ID_1 != null) {

								var o1 = $(name+" circle[index='"+o.ACTOR_ID_0+"']");
								var o2 = $(name+" circle[index='"+o.ACTOR_ID_1+"']");

								var x1 = o1.attr("cx");
								var y1 = o1.attr("cy");

								var x2 = o2.attr("cx");
								var y2 = o2.attr("cy");



								var mx = (parseFloat(x1) + parseFloat(x2)) / 2;
								var my = (parseFloat(y1) + parseFloat(y2)) / 2;


								if (x1 != undefined && x2 != undefined && y1 != undefined && y2 != undefined) {

									$(this).attr("points", x1+", "+y1+" "+mx+", "+my+" "+x2+", "+y2);	
									


								}


								if (o.DIRECTION != $(this).attr("direction")) {

									$(this).attr("direction", o.DIRECTION);	

								}	




							}

						}


					});


					$.each(cwcData.INTERACTIONS, function(i,o){

						var canvas = $(name)[0];

						if ($(name+" polyline[index='"+o.INTERACTION_ID+"']").length == 0) {

							if (o.ACTOR_ID_0 != "0" && o.ACTOR_ID_1 != "0" && o.ACTOR_ID_0 != "" && o.ACTOR_ID_1 != "" && o.ACTOR_ID_0 != null && o.ACTOR_ID_1 != null) {

								var o1 = $(name+" circle[index='"+o.ACTOR_ID_0+"']");
								var o2 = $(name+" circle[index='"+o.ACTOR_ID_1+"']");

								var x1 = o1.attr("cx");
								var y1 = o1.attr("cy");

								var x2 = o2.attr("cx");
								var y2 = o2.attr("cy");


								var mx = (parseFloat(x1) + parseFloat(x2)) / 2;
								var my = (parseFloat(y1) + parseFloat(y2)) / 2;


								if (x1 != undefined && x2 != undefined && y1 != undefined && y2 != undefined) {

									var path = cwcGraphMakeSVG("polyline", {points: x1+", "+y1+" "+mx+", "+my+" "+x2+", "+y2, index: o.INTERACTION_ID, actor0: o.ACTOR_ID_0, actor1: o.ACTOR_ID_1, stroke: "#ccc", "stroke-width": 2, direction: o.DIRECTION});
									canvas.prepend(path);			


								}




							}

						}

					});

				}








			}
			


		});





	});




}

var cwcData = {};

poll.cwcListener = function(){

	if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {

		var msg = "hello world";

		$("#cwc_listener_log").attr("loading", "true");

		$.ajax({
			url: "/modules/cwc/graph/poll.php",
			data:{
				session: session_id
			},
			success: function(data){


				var date = moment().format("YYYY-MM-DD hh:mm:ss");

				$("#cwc_listener_log").text("["+date+"]\n"+data+"\n\n");

				cwcData = JSON.parse(data);

				$("#cwc_listener_log").removeAttr("loading");

				if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {

					$.each(trigger, function(i,o){

						o();

					});

				}

			}
			
		});

	}

}


var cwc_graph_active = true;
var cwc_graph_angle = false;
var cwc_graph_index = null;
var cwc_graph_id = null;

$(document).on("mousedown", ".cwc_graph_svg_top", function(e){

	cwc_graph_id = $(this).attr("id");
	cwc_graph_active = true;
	cwc_graph_index = $(".cwc_graph_svg_top circle:hover").attr("index");


	if (cwc_graph_index == undefined) {

		cwc_graph_index = $(".cwc_graph_svg_top line:hover").attr("index");

		if (cwc_graph_index != undefined) {

			cwc_graph_angle = true;

		}

	}

	console.log(cwc_graph_active);
	console.log(cwc_graph_angle);
	console.log(cwc_graph_index);
	console.log(cwc_graph_id);

	$("#cwc_listener_log").attr("writing", "true");

});





$(document).on("dblclick", "#cwc_graph_svg_elevation circle", function(e){

	var cWidth = $(".cwc_graph_svg_top").outerWidth();
	var cHeight = $(".cwc_graph_svg_top").outerHeight();

	var index = $(this).attr("index");

	var x = $("#cwc_graph_svg_elevation circle[index='"+index+"']").attr("cx");
	var px = parseFloat(x) / cWidth * 100;

	$("#cwc_listener_log").attr("writing", "true");

	$.ajax({
		url: "/modules/cwc/position/push.php",
		type: "POST",
		data: {
			id: index,
			x: px,
			z: 0
		},
		success: function(data){

			$("#cwc_listener_log").removeAttr("writing");

			var y = (cHeight/2)+"px";

			$("#cwc_graph_svg_elevation circle[index='"+index+"']").attr("cy", y);
			$("#cwc_graph_svg_elevation text[index='"+index+"']").attr("x", x).attr("y", y);
			$("#cwc_graph_svg_elevation text[index='"+index+"'] tspan").attr("x", x);
		}
	});		

});



$(document).on("mouseup", ".cwc_graph_svg_top", function(e){

	if (cwc_graph_active == true && cwc_graph_index != null && cwc_graph_id != null && cwc_graph_angle == false){

		var cWidth = $(".cwc_graph_svg_top").outerWidth();
		var cHeight = $(".cwc_graph_svg_top").outerHeight();

		var x = $("#"+cwc_graph_id+".cwc_graph_svg_top circle[index='"+cwc_graph_index+"']").attr("cx");


		$("#cwc_listener_log").attr("writing", "true");

		if (cwc_graph_id == "cwc_graph_svg_elevation") {


			var y = $("#"+cwc_graph_id+".cwc_graph_svg_top circle[index='"+cwc_graph_index+"']").attr("cy");
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
				url: "/modules/cwc/position/push.php",
				type: "POST",
				data: {
					id: cwc_graph_index,
					x: px,
					z: z
				},
				success: function(data){

					$("#cwc_listener_log").removeAttr("writing");
					cwc_graph_active = false;
					cwc_graph_index = null;
					cwc_graph_id = null;
					cwc_graph_angle = false;

					//$(".cwc_graph_svg_top circle.active").removeClass("active");

				}
			});		


		} else {

			var y = $("#"+cwc_graph_id+".cwc_graph_svg_top circle[index='"+cwc_graph_index+"']").attr("cy");

			var px = parseFloat(x) / cWidth * 100;
			var py = parseFloat(y) / cHeight * 100;


			$.ajax({
				url: "/modules/cwc/position/push.php",
				type: "POST",
				data: {
					id: cwc_graph_index,
					x: px,
					y: py
				},
				success: function(data){

					$("#cwc_listener_log").removeAttr("writing");
					cwc_graph_active = false;
					cwc_graph_index = null;
					cwc_graph_id = null;
					cwc_graph_angle = false;

					// $(".cwc_graph_svg_top circle.active").removeClass("active");

				}
			});		

		}


	} else if (cwc_graph_active == true && cwc_graph_index != null && cwc_graph_id != null && cwc_graph_angle == true) {

		var x1 = parseFloat($("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("x1"));
		var y1 = parseFloat($("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("y1"));
		var x2 = parseFloat($("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("x2"));
		var y2 = parseFloat($("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("y2"));

		var deltaX = x2 - x1;
		var deltaY = y2 - y1;
		var rad = Math.atan2(deltaY, deltaX);
		var deg = rad * (180 / Math.PI)		

		var rz = deg - 90;


		var radian = (parseFloat(rz) + 90) * Math.PI / 180;
		var ax = x1 + 30 * Math.cos(radian);
		var ay = y1 + 30 * Math.sin(radian);		

		$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("x2", ax);
		$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("y2", ay);
		$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("rotation", rz);

		$("#cwc_listener_log").attr("writing", "true");

		$.ajax({
			url: "/modules/cwc/position/push.php",
			type: "POST",
			data: {
				id: cwc_graph_index,
				rz: rz
			},
			success: function(data){



				$("#cwc_listener_log").removeAttr("writing");
				cwc_graph_active = false;
				cwc_graph_index = null;
				cwc_graph_id = null;
				cwc_graph_angle = false;



			}
		});		



	}



});




$(document).on("dblclick", "#cwc_graph_svg_conceptual circle[type]", function(e){

	var index = $(this).attr("index");
	var type = $(this).attr("type");
	var label = $("#cwc_graph_svg_conceptual text.label[index='"+index+"']").text();

	var lines = $("#cwc_graph_svg_conceptual polyline[actor0='"+index+"'], #cwc_graph_svg_conceptual polyline[actor1='"+index+"']").length;

	if (type == "ACTION") {

		if (label.indexOf("Walking") > -1) {

			if (lines == 2) {

				alert("This walking ACTION node has preexisting connections to two other nodes.");
				return false;

			}

		} else {

			if (lines > 0) {

				alert("This ACTION node has a preexisting connection to another node.");
				return false;

			}


		}


	}


	$("#cwc_graph_svg_conceptual rect[index='"+index+"'], #cwc_graph_svg_conceptual circle[index='"+index+"']").toggleClass("active");


	console.log(label);



	if ($("#cwc_graph_svg_conceptual circle[index].active").length == 2) {

		cwcProcessActive();
		$("#cwc_graph_svg_conceptual *[index]").removeClass("active");
		$("#cwc_graph_prompt").hide();

	} else if ($("#cwc_graph_svg_conceptual circle[index].active").length == 0) {

		$("#cwc_graph_prompt").hide();

	} else {


		var type = $("#cwc_graph_svg_conceptual circle[index].active").attr("type");

		if (type == "CHARACTER") {

			$("#cwc_graph_prompt").text("Double click an ACTION or a POSITION.");
			$("#cwc_graph_prompt").show();

		} else if (type == "ACTION") {


			if (label.indexOf("Walking") > -1) {

				$("#cwc_graph_prompt").text("Double click a CHARACTER or a PROP.");

			} else {

				$("#cwc_graph_svg_conceptual *[index]").removeClass("active");
				alert("Start with a CHARACTER.");
				return false;
		//		$("#cwc_graph_prompt").text("Double click a CHARACTER.");

			}


			$("#cwc_graph_prompt").show();

		} else if (type == "POSITION") {

			$("#cwc_graph_prompt").text("Double click a CHARACTER or a PROP.");
			$("#cwc_graph_prompt").show();

		} else if (type == "PROP") {

			$("#cwc_graph_prompt").text("Double click a POSITION.");
			$("#cwc_graph_prompt").show();

		} else {

			$("#cwc_graph_svg_conceptual *[index]").removeClass("active");
			$("#cwc_graph_prompt").hide();

		}


	}



});


function cwcProcessActive(){

	var array = [];
	var arrayIndex = [];

	$("#cwc_graph_svg_conceptual circle[index].active").each(function(){

		var type = $(this).attr("type");
		var index = $(this).attr("index");
		array.push(type);
		arrayIndex.push(index);

	});


	var actor0 = null;
	var actor1 = null;
	var type = null;
	var order = null;

	var direction = 2;

	if (array.indexOf("ACTION") != -1 && array.indexOf("CHARACTER") != -1) {

		if (array.indexOf("CHARACTER") == 0) {

			actor0 = arrayIndex[0];
			actor1 = arrayIndex[1];



		} else {

			actor0 = arrayIndex[1];
			actor1 = arrayIndex[0];

		}


		var lines = $("#cwc_graph_svg_conceptual polyline[actor1='"+actor1+"']").length;

		if (lines == 1) {

			direction = 1;

		} else {

			direction = 0;

		}

		if ($("#cwc_graph_svg_conceptual text[index='"+actor1+"']").text().indexOf("Walking") == -1) {

			direction = 2;

		}


		type = 1;

		order = $("#cwc_event_list tr:not(.timeline_row)").length+1;	


	} else if (array.indexOf("ACTION") != -1 && array.indexOf("PROP") != -1) {

		if (array.indexOf("PROP") == 0) {

			actor0 = arrayIndex[0];
			actor1 = arrayIndex[1];

		} else {

			actor0 = arrayIndex[1];
			actor1 = arrayIndex[0];

		}

		direction = 1;

		type = 1;
		order = $("#cwc_event_list tr:not(.timeline_row)").length+1;	

		if ($("#cwc_graph_svg_conceptual text[index='"+actor1+"']").text().indexOf("Walking") == -1) {

			alert("Invalid selection.");
			return false;

		}


		var lines = $("#cwc_graph_svg_conceptual polyline[actor1='"+actor1+"']").length;

		if (lines == 1) {

			var other =  $("#cwc_graph_svg_conceptual polyline[actor1='"+actor1+"']").attr("actor0");

			if ( $("#cwc_graph_svg_conceptual circle[index='"+other+"']").attr("type") == "PROP") {

				alert("You cannot have PROP-WALKING-PROP connection.");
				return false;

			}

			// alert("This Walking ACTION already has a CHARACTER.");
			// return false;




		}



	} else if (array.indexOf("POSITION") != -1 && array.indexOf("CHARACTER") != -1) {


		if (array.indexOf("CHARACTER") == 0) {

			actor0 = arrayIndex[0];
			actor1 = arrayIndex[1];

		} else {

			actor0 = arrayIndex[1];
			actor1 = arrayIndex[0];

		}


		var lines = $("#cwc_graph_svg_conceptual polyline[actor1='"+actor1+"']").length;

		if (lines == 2) {

			alert("This POSITION already two connections.");
			return false;

		}


		type = 2;
		order = $("#cwc_relationship_list tr").length+1;	

	} else if (array.indexOf("POSITION") != -1 && array.indexOf("PROP") != -1) {

		if (array.indexOf("PROP") == 0) {

			actor0 = arrayIndex[0];
			actor1 = arrayIndex[1];

		} else {

			actor0 = arrayIndex[1];
			actor1 = arrayIndex[0];

		}

		var lines = $("#cwc_graph_svg_conceptual polyline[actor1='"+actor1+"']").length;

		if (lines == 2) {

			alert("This POSITION already two connections.");
			return false;

		}


		type = 2;
		order = $("#cwc_relationship_list tr").length+1;	

	} else {

		alert("Invalid selection.");

	}

	if (actor0 != null && actor1 != null) {

		if ($("#cwc_graph_svg_conceptual polyline[actor0='"+actor0+"'][actor1='"+actor1+"']").length > 0) {

			$("#cwc_graph_prompt").hide();
			alert("This connection already exists.");

			return false;

		} else {

			$.ajax({
				url: "/modules/cwc/graph/add_interaction.php",
				type: "POST",
				data: {
					actor0: actor0,
					actor1: actor1,
					type: type,
					order: order,
					direction: direction
				},		
				success: function(data){

					$.each(poll, function(i,o){

						o();

					});

					$("#cwc_graph_prompt").hide();


					if (type == 1 && $("#cwc_graph_svg_conceptual text[index='"+actor1+"']").text().indexOf("Walking") != -1 && $("#cwc_graph_svg_conceptual polyline[actor1='"+actor1+"']").length == 0) {

						$("#cwc_graph_svg_conceptual rect[index='"+actor1+"'], #cwc_graph_svg_conceptual circle[index='"+actor1+"']").addClass("active");
						$("#cwc_graph_prompt").text("This ACTION is 'Walking' --- double click a CHARACTER or a PROP.");
						$("#cwc_graph_prompt").show();						

					}


				}
			});


		}




	}


}


$(document).on("mousemove", ".cwc_graph_svg_top", function(e){




	if (cwc_graph_active == true && cwc_graph_index != null && cwc_graph_id != null && cwc_graph_angle == false) {

		// $("#"+cwc_graph_id+".cwc_graph_svg_top circle[index='"+cwc_graph_index+"']").addClass("active");

		var y = Math.abs(e.pageY - $("#"+cwc_graph_id+".cwc_graph_svg_top").position().top);
		var x = Math.abs(e.pageX - $("#"+cwc_graph_id+".cwc_graph_svg_top").position().left);


		$("#"+cwc_graph_id+".cwc_graph_svg_top circle[index='"+cwc_graph_index+"']").attr("cx", x);
		$("#"+cwc_graph_id+".cwc_graph_svg_top circle[index='"+cwc_graph_index+"']").attr("cy", y);
		$("#"+cwc_graph_id+".cwc_graph_svg_top rect[index='"+cwc_graph_index+"']").attr("x", x-15);
		$("#"+cwc_graph_id+".cwc_graph_svg_top rect[index='"+cwc_graph_index+"']").attr("y", y-15);
		$("#"+cwc_graph_id+".cwc_graph_svg_top text[index='"+cwc_graph_index+"']").attr("x", x).attr("y", y);
		$("#"+cwc_graph_id+".cwc_graph_svg_top text[index='"+cwc_graph_index+"'] tspan").attr("x", x);

		if (cwc_graph_id == "cwc_graph_svg_conceptual") {

			$("#cwc_graph_svg_conceptual polyline[index]").each(function(){

				var id = $(this).attr("index");

				var o = cwcData.INTERACTIONS[id];

				if (o.ACTOR_ID_0 != "0" && o.ACTOR_ID_1 != "0" && o.ACTOR_ID_0 != "" && o.ACTOR_ID_1 != "" && o.ACTOR_ID_0 != null && o.ACTOR_ID_1 != null) {

					var o1 = $("#cwc_graph_svg_conceptual circle[index='"+o.ACTOR_ID_0+"']");
					var o2 = $("#cwc_graph_svg_conceptual circle[index='"+o.ACTOR_ID_1+"']");

					var x1 = o1.attr("cx");
					var y1 = o1.attr("cy");

					var x2 = o2.attr("cx");
					var y2 = o2.attr("cy");

					var mx = (parseFloat(x1) + parseFloat(x2)) / 2;
					var my = (parseFloat(y1) + parseFloat(y2)) / 2;


					$(this).attr("points", x1+", "+y1+" "+mx+", "+my+" "+x2+", "+y2);	

				}


			});



		}


		if (cwc_graph_id == "cwc_graph_svg_stage") {

			var rz = parseFloat($("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("rotation"));

			var radian = (parseFloat(rz) + 90) * Math.PI / 180;
			var ax = x + 30 * Math.cos(radian);
			var ay = y + 30 * Math.sin(radian);		


			$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("x1", x);
			$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("y1", y);
			$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("x2", ax);
			$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("y2", ay);


		}


	} else if (cwc_graph_active == true && cwc_graph_index != null && cwc_graph_id != null && cwc_graph_angle == true) {

		var y = Math.abs(e.pageY - $("#"+cwc_graph_id+".cwc_graph_svg_top").position().top);
		var x = Math.abs(e.pageX - $("#"+cwc_graph_id+".cwc_graph_svg_top").position().left);



		$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("x2", x);
		$("#cwc_graph_svg_stage line[index='"+cwc_graph_index+"']").attr("y2", y);

	}


});

