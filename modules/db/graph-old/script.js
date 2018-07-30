callback.cwcGraph = function(){
	
	var element = $("div[module='db/graph']");
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


trigger.cwcGraph = function(){

	var canvas = $("#cwc_graph_svg")[0];

	var types = ["CHARACTER", "PROP", "ACTION", "POSITION", "CAMERA"];

	$.each(types, function(i,o){

		var type = o;

		var cwcDataList = cwcData["ACTORS"][o];

		if (cwcDataList != undefined) {

			var cWidth = $("#cwc_graph_svg").outerWidth();
			var cHeight = $("#cwc_graph_svg").outerHeight();

			$("#cwc_graph_svg circle[index][type='"+type+"']").each(function(){

				var id = $(this).attr("index");

				// console.log(id);

				if (cwcDataList[id] == undefined) {

					// console.log(id);

					$(this).remove();
					$("#cwc_graph_svg circle[index='"+id+"']").remove();
					$("#cwc_graph_svg text[index='"+id+"']").remove();

				} else {


					if (id != cwc_graph_index) {

						var x = cWidth * parseFloat(cwcDataList[id].X)/100;
						var y = cHeight * parseFloat(cwcDataList[id].Y)/100;

						var r = (parseFloat(cwcDataList[id].Z)/100*5) + 15;

						if (isNaN(r) == true) {

							r = 15;

						}

						if (x != $(this).attr("cx") || y != $(this).attr("cy") || r != $(this).attr("r") || cwcDataList[id].ACTOR_NAME != $("#cwc_graph_svg text[index='"+id+"'].label").text()) {

							$(this).attr("cx", x).attr("cy", y).attr("r", r);
							$("#cwc_graph_svg text[index='"+id+"']").attr("x", x).attr("y", y);
							$("#cwc_graph_svg text[index='"+id+"'] tspan").attr("x", x);
							$("#cwc_graph_svg text[index='"+id+"'].label").text(cwcDataList[id].ACTOR_NAME);
							

						}



						if (cwcData["ATTRIBUTES"][id] != undefined) {

							var text = $("#cwc_graph_svg text[index='"+id+"'].attr")[0];

							$("#cwc_graph_svg text[index='"+id+"'].attr tspan").remove();

							$.each(cwcData["ATTRIBUTES"][id], function(i,o){

								var attributes = o["LABEL"]+": "+o["VALUE"]+" ("+o["ATTRIBUTE_TYPE_NAME"]+")";
								var tline = cwcGraphMakeSVG("tspan", {x: x, dy: "1.3em", index: o.ATTRIBUTE_ID}, attributes);

								text.appendChild(tline);

							});

						} else {

							$("#cwc_graph_svg text[index='"+id+"'].attr tspan").remove();
							
						}



					}


				}

			});


			$.each(cwcDataList, function(i,o){

				var x = cWidth * parseFloat(o.X)/100;
				var y = cHeight * parseFloat(o.Y)/100;
				var r = (parseFloat(o.Z)/100*5) + 15;

				if (isNaN(r) == true) {

					r = 15;

				}

				if ($("#cwc_graph_svg circle[index='"+o.ACTOR_ID+"']").length == 0) {

					var circle = cwcGraphMakeSVG("circle", {r: r, cx: x, cy: y, "stroke-width": 1, "stroke": "#000", index: o.ACTOR_ID, type: type});
					canvas.appendChild(circle);

					var text = cwcGraphMakeSVG("text", {x: x, y: y, index: o.ACTOR_ID, class: "label"}, o.ACTOR_NAME);
					canvas.appendChild(text);

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


	$("#cwc_graph_svg line[index]").each(function(){


		var id = $(this).attr("index");

		if (cwcData.INTERACTIONS[id] == undefined) {

			$(this).remove();

		} else {

			var o = cwcData.INTERACTIONS[id];

			if (o.ACTOR_ID_0 != "0" && o.ACTOR_ID_1 != "0" && o.ACTOR_ID_0 != "" && o.ACTOR_ID_1 != "" && o.ACTOR_ID_0 != null && o.ACTOR_ID_1 != null) {

				var o1 = $("#cwc_graph_svg circle[index='"+o.ACTOR_ID_0+"']");
				var o2 = $("#cwc_graph_svg circle[index='"+o.ACTOR_ID_1+"']");

				var x1 = o1.attr("cx");
				var y1 = o1.attr("cy");

				var x2 = o2.attr("cx");
				var y2 = o2.attr("cy");

				$(this).attr("x1", x1);	
				$(this).attr("x2", x2);	
				$(this).attr("y1", y1);	
				$(this).attr("y2", y2);	

			}

		}

	});


	$.each(cwcData.INTERACTIONS, function(i,o){

		if ($("#cwc_graph_svg line[index='"+o.INTERACTION_ID+"']").length == 0) {

			if (o.ACTOR_ID_0 != "0" && o.ACTOR_ID_1 != "0" && o.ACTOR_ID_0 != "" && o.ACTOR_ID_1 != "" && o.ACTOR_ID_0 != null && o.ACTOR_ID_1 != null) {

				var o1 = $("#cwc_graph_svg circle[index='"+o.ACTOR_ID_0+"']");
				var o2 = $("#cwc_graph_svg circle[index='"+o.ACTOR_ID_1+"']");

				var x1 = o1.attr("cx");
				var y1 = o1.attr("cy");

				var x2 = o2.attr("cx");
				var y2 = o2.attr("cy");

				var line = cwcGraphMakeSVG("line", {x1: x1, y1: y1, x2: x2, y2: y2, index: o.INTERACTION_ID, stroke: "#ccc", "stroke-width": 2});

				canvas.prepend(line);			

			}

		}

	});



}

var cwc_graph_active = true;
var cwc_graph_index = null;

$(document).on("mousedown", "#cwc_graph_svg", function(e){

	cwc_graph_active = true;
	cwc_graph_index = $("#cwc_graph_svg circle:hover").attr("index");

	console.log(cwc_graph_active);
	console.log(cwc_graph_index);

	$("#cwc_listener_log").attr("writing", "true");

});


$(document).on("mouseup", "#cwc_graph_svg", function(e){

	if (cwc_graph_active == true && cwc_graph_index != null){

		var cWidth = $("#cwc_graph_svg").outerWidth();
		var cHeight = $("#cwc_graph_svg").outerHeight();

		var x = $("#cwc_graph_svg circle[index='"+cwc_graph_index+"']").attr("cx");
		var y = $("#cwc_graph_svg circle[index='"+cwc_graph_index+"']").attr("cy");

		console.log(x);
		console.log(y);

		var px = parseFloat(x) / cWidth * 100;
		var py = parseFloat(y) / cHeight * 100;

		$.ajax({
			url: "/modules/db/graph/push.php",
			type: "POST",
			data: {
				id: cwc_graph_index,
				x: px,
				y: py
			},
			success: function(data){

				$("#cwc_listener_log").removeAttr("writing");


			}
		});		


	}

	cwc_graph_active = false;
	cwc_graph_index = null;

	$("#cwc_graph_svg circle.active").removeClass("active");

	console.log(cwc_graph_active);
	console.log(cwc_graph_index);

});



$(document).on("mousemove", "#cwc_graph_svg", function(e){


	if (cwc_graph_active == true && cwc_graph_index != null){

		$("#cwc_graph_svg circle[index='"+cwc_graph_index+"']").addClass("active");

		var y = Math.abs(e.pageY - $("#cwc_graph_svg").position().top);
		var x = Math.abs(e.pageX - $("#cwc_graph_svg").position().left);

		$("#cwc_graph_svg circle[index='"+cwc_graph_index+"']").attr("cx", x);
		$("#cwc_graph_svg circle[index='"+cwc_graph_index+"']").attr("cy", y);
		$("#cwc_graph_svg text[index='"+cwc_graph_index+"']").attr("x", x).attr("y", y);
		$("#cwc_graph_svg text[index='"+cwc_graph_index+"'] tspan").attr("x", x);



		$("#cwc_graph_svg line[index]").each(function(){

			var id = $(this).attr("index");

			var o = cwcData.INTERACTIONS[id];

			if (o.ACTOR_ID_0 != "0" && o.ACTOR_ID_1 != "0" && o.ACTOR_ID_0 != "" && o.ACTOR_ID_1 != "" && o.ACTOR_ID_0 != null && o.ACTOR_ID_1 != null) {

				var o1 = $("#cwc_graph_svg circle[index='"+o.ACTOR_ID_0+"']");
				var o2 = $("#cwc_graph_svg circle[index='"+o.ACTOR_ID_1+"']");

				var x1 = o1.attr("cx");
				var y1 = o1.attr("cy");

				var x2 = o2.attr("cx");
				var y2 = o2.attr("cy");

				$(this).attr("x1", x1);	
				$(this).attr("x2", x2);	
				$(this).attr("y1", y1);	
				$(this).attr("y2", y2);	

			}


		});




	}


});

$(document).on("dblclick", "#cwc_graph_svg circle", function(e){

	var index = $(this).attr("index");

	var type = $("#cwc_actor_list tr[data-db='"+index+"']").data("type");

	$("#cwc_asset_mode a[data-type='"+type+"']").click();

	$("#cwc_actor_list tr[data-db='"+index+"'] i.cwc_asset_attribute").click();

});


// $(document).on("click", "#cwc_graph_svg text", function(e){


// 	e.preventDefault();

// 	var value = $(this).text();

// 	var response = prompt("Please provide the new name", value);

// 	if (response != null) {

// 		$("#cwc_listener_log").attr("writing", "true");

// 		var id = $(this).attr("index");
// 		var nameDOM = $(this);
		
// 		$.ajax({
// 			url: "/modules/db/graph/rename.php",
// 			type: "POST",
// 			data: {
// 				id: id,
// 				name: response	
// 			},
// 			success: function(data){

// 				nameDOM.text(response);

// 				$("#cwc_listener_log").removeAttr("writing");

// 			}
// 		});
		
// 	}


// });


callback.cwcListener = function(){


}

var cwcData = {};

poll.cwcListener = function(){

	if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {

		var msg = "hello world";

		$("#cwc_listener_log").attr("loading", "true");

		$.ajax({
			url: "/modules/db/graph/poll.php",
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

