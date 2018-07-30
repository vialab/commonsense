callback.relationalSummary = function(){


	if ($("div[module='relational/summary']").attr("meta") != undefined && $("div[module='relational/summary']").attr("meta") != "") {

		var path = "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='relational/summary']").attr("meta");

		$.ajax({
			url: path,
			filetype: "json",
			success: function(data){


				// $("#relational-summary-canvas").css("height", "208px");

				var data = JSON.parse(data);
				console.log(data);

				$("#relational-summary-alert").remove();
				$("#relational-summary-instructions").closest("div.card").remove();


				relationalSummaryPassive(data);


			}

		});


	}


	if (input.video != undefined && input.video.h != undefined) {

		$("#relational-summary-canvas-container").height(input.video.h+"px");

		var element = $("div[module='relational/summary']");
		var height = element.find(".content").outerHeight();
		element.css("height", height+"px");			


	}


	var element = $("div[module='relational/summary']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");	


	// trigger.relationalSummaryGenerate();

}

relationalSummaryOffset = 10;


relationSummaryCapturePosition = function(){



	if (input.position == undefined) {

		input.position = {};

	}


	if (input.connection == undefined) {

		input.connection = {};

	}


	$("#relational-summary-canvas circle").each(function(){

		var item = $(this);

		var x = item.attr("cx");
		var y = item.attr("cy");


		// var name = 

		var id = $(this).attr("index");

		input.position[id] = {};
		input.position[id].x = parseFloat(x);
		input.position[id].y = parseFloat(y);

	});


	save();

};

trigger.relationalSummaryGenerate = function(){


	if (input.position == undefined) {

		input.position = {};

	}


	if (input.connection == undefined) {

		input.connection = {};

	}


	$("#relational-summary-canvas *").remove();

	if (input.entity != undefined) {

		$.each(input.entity, function(i,o){

			var meta = ""; //" (" + o.entity + ": " + + o.start + "%-" + o.end + "%)";

			if (input.position == undefined || input.position[o.id] == undefined) {

				var x = $("#relational-summary-canvas").outerWidth() * Math.random();
				var y = $("#relational-summary-canvas").outerHeight() * Math.random();

			} else {

				var x = input.position[o.id].x;
				var y = input.position[o.id].y;

			}


			relationalSummaryInsert(o.id, o.name, meta, "visual", x, y);


		});

	}


	if (input.token != undefined) {

		$.each(input.token, function(i,o){

			var meta = ""; //" (" + o.text + ")";

			if (input.position == undefined || input.position[o.id] == undefined) {

				var x = $("#relational-summary-canvas").outerWidth() * Math.random();
				var y = $("#relational-summary-canvas").outerHeight() * Math.random();

			} else {

				var x = input.position[o.id].x;
				var y = input.position[o.id].y;

			}


			relationalSummaryInsert(o.id, o.name, meta, "textual", x, y);


		});

	}

	if (input.connection != undefined) {

		$.each(input.connection, function(i,o){

			var array = i.split(":");

			var start = array[0];
			var end = array[1];


			var startObj = $("#relational-summary-canvas circle[index='"+start+"']");
			var endObj = $("#relational-summary-canvas circle[index='"+end+"']");

			var x1 = parseInt(startObj.attr("cx"));
			var x2 = parseInt(endObj.attr("cx"));

			var y1 = parseInt(startObj.attr("cy"));
			var y2 = parseInt(endObj.attr("cy"));


			if (x1 != -100 && x2 != -100 && y1 != -100 && y2 != -100) {

				var line = relationalSummaryInsertMakeSvg("line", {x1: x1, x2: x2, y1: y1, y2: y2, stroke: "#ccc", "stroke-width": 2, start: start, end: end});

				var canvas = $("#relational-summary-canvas")[0];
				canvas.prepend(line);

			}


		});


	}


	if ($("#relational-summary-canvas *").length == 0) {

		$("#relational-summary-instructions").text("No nodes available.");
		$("#relational-summary-instructions").removeClass("alert-info").addClass("alert-danger");

		$("#relational-summary-box").hide();

	}


}

function relationalSummaryInsert(id, text, meta, type, x, y) {

	var canvas = $("#relational-summary-canvas")[0];

	var index = $("#relational-summary-canvas circle").length;


	if (type == "visual") {


		var opacity = 1;
		var dash = "";

		if (input.hide != undefined && input.hide[id] != undefined && input.hide[id] === true) {

			opacity = 1;
			dash = "5, 5";


		}

		var circle = relationalSummaryInsertMakeSvg("circle", {cx: x, cy: y, r:relationalSummaryOffset, fill: "#eee", "stroke-width": 1, "stroke": "#000", "stroke-dasharray": dash, opacity: opacity,  index: id, type: "visual"});
		canvas.appendChild(circle);
		


		var circle = relationalSummaryInsertMakeSvg("text", {x: x+relationalSummaryOffset, y: y-relationalSummaryOffset, "font-size": 11, fill: "black", "text-anchor": "left", "alignment-baseline": "bottom", index: id}, text + meta);
		canvas.appendChild(circle);

	} else if (type == "textual") {

		var color = "black";

		if (input.token != undefined) {

			if (input.token[id] != undefined && input.token[id].type == "qa") {

				color = "blue";
				meta = " (QA)";

			} else if (input.token[id] != undefined && input.token[id].type == "q") {

				color = "blue";
				meta = " (Q)";


			} else if (input.token[id] != undefined && input.token[id].type == "a") {

				color = "green";
				meta = " (A)";


			}

		}


		var circle = relationalSummaryInsertMakeSvg("circle", {cx: x, cy: y, r:relationalSummaryOffset * 0.5, fill: color, index: id, type: "textual"});
		canvas.appendChild(circle);
		
		var circle = relationalSummaryInsertMakeSvg("text", {x: x+relationalSummaryOffset, y: y-relationalSummaryOffset, "font-size": 10, fill: "black", "text-anchor": "left", "alignment-baseline": "bottom", index: id}, text + meta);
		canvas.appendChild(circle);

	}

}


function relationalSummaryInsertMakeSvg(tag, attrs, text) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }


    if (text != undefined) {

	    el.innerHTML = text;

    }


    return el;
}


var relational_summary_index = null;
var relational_summary_active = null;


$(document).on("mousedown", "#relational-summary-canvas", function(e){

	relational_summary_active = true;
	relational_summary_index = $("#relational-summary-canvas circle[type='textual']:hover").attr("index");

});


$(document).on("mouseup", "#relational-summary-canvas", function(e){

	relational_summary_active = null;
	relational_summary_index = null

	relationSummaryCapturePosition();

});



$(document).on("dblclick", "#relational-summary-canvas circle", function(e){

	$(this).toggleClass("active");



	if ($("#relational-summary-canvas circle.active").length == 2) {


		var start = $("#relational-summary-canvas circle.active:first").attr("index");
		var end = $("#relational-summary-canvas circle.active:last").attr("index");


		var startType = $("#relational-summary-canvas circle.active:first").attr("type");
		var endType = $("#relational-summary-canvas circle.active:last").attr("type");



		if (startType == "visual" && endType == "visual") {

			alert("You cannot connect two visual entities.");

			$("#relational-summary-canvas circle.active").removeClass("active");

			$("#relational-summary-edit-name").val("");
			$("#relational-summary-edit-id").val("");

			$("#relational-summary-edit-box").hide();

			return false;
			
		}


		if ($("#relational-summary-canvas line[start='"+start+"'][end='"+end+"']").length > 0) {

			$("#relational-summary-canvas line[start='"+start+"'][end='"+end+"']").remove();
			delete input.connection[start+":"+end];




		} else {



			var startObj = $("#relational-summary-canvas circle.active:first");
			var endObj = $("#relational-summary-canvas circle.active:last");

			var x1 = parseInt(startObj.attr("cx"));
			var x2 = parseInt(endObj.attr("cx"));

			var y1 = parseInt(startObj.attr("cy"));
			var y2 = parseInt(endObj.attr("cy"));


			var line = relationalSummaryInsertMakeSvg("line", {x1: x1, x2: x2, y1: y1, y2: y2, stroke: "#ccc", "stroke-width": 2, start: start, end: end});


			var canvas = $("#relational-summary-canvas")[0];

			canvas.prepend(line);


			input.connection[start+":"+end] = (new Date().getTime()).toString(16);


		}


		$("#relational-summary-canvas circle.active").removeClass("active");

		$("#relational-summary-edit-name").val("");
		$("#relational-summary-edit-id").val("");

		$("#relational-summary-edit-box").hide();


		save();

	} else if ($("#relational-summary-canvas circle.active").length == 1) {


		var id = $("#relational-summary-canvas circle.active").attr("index");

		if (input.entity != undefined && input.entity[id] != undefined) {

			$("#relational-summary-edit-name").val(input.entity[id].name);
			$("#relational-summary-edit-id").val(id);

			$("#relational-summary-edit-box").show();

		} else if (input.token != undefined && input.token[id] != undefined) {

			$("#relational-summary-edit-name").val(input.token[id].name);
			$("#relational-summary-edit-id").val(id);

			$("#relational-summary-edit-box").show();

		} else {



		}



	} else {

		$("#relational-summary-edit-name").val("");
		$("#relational-summary-edit-id").val("");

		$("#relational-summary-edit-box").hide();

	}

});


$(document).on("mousemove", "#relational-summary-canvas", function(e){


	if (relational_summary_active == true && relational_summary_index != null){


		var y = Math.abs(e.pageY - $("#relational-summary-canvas").position().top);
		var x = Math.abs(e.pageX - $("#relational-summary-canvas").position().left);


		$("#relational-summary-canvas circle[index='"+relational_summary_index+"']").attr("cx", x);
		$("#relational-summary-canvas circle[index='"+relational_summary_index+"']").attr("cy", y);

		$("#relational-summary-canvas text[index='"+relational_summary_index+"']").attr("x", x+relationalSummaryOffset);
		$("#relational-summary-canvas text[index='"+relational_summary_index+"']").attr("y", y-relationalSummaryOffset);

		$("#relational-summary-canvas line").each(function(){

			var start = $(this).attr("start");			
			var end = $(this).attr("end");			

			var startObj = $("#relational-summary-canvas circle[index='"+start+"']");
			var endObj = $("#relational-summary-canvas circle[index='"+end+"']");


			var x1 = parseInt(startObj.attr("cx"));
			var x2 = parseInt(endObj.attr("cx"));

			var y1 = parseInt(startObj.attr("cy"));
			var y2 = parseInt(endObj.attr("cy"));



			$(this).attr("x1", x1);
			$(this).attr("x2", x2);
			$(this).attr("y1", y1);
			$(this).attr("y2", y2);

		});


	}


});



$(document).on("click", "#relational-summary-edit-remove", function(e){

	if ($("#relational-summary-edit-id").val() != "") {

		var id = $("#relational-summary-edit-id").val();


		$("#relational-summary-edit-name").val("");
		$("#relational-summary-edit-id").val("");

		$("#relational-summary-edit-box").hide();

		delete input.entity[id];

		if (input.token != null) {

			delete input.token[id];

		}



		delete input.position[id];

		$.each(input.connection, function(i,o){

			if (i.indexOf(id) > -1) {

				delete input.connection[i];

			}

		});

		console.log(input.connection);

		save();



		$.each(trigger, function(i,o){

			o();

		});



	}

});


$(document).on("click", "#relational-summary-edit-save", function(e){

	if ($("#relational-summary-edit-id").val() != "" && $("#relational-summary-edit-name").val() != "") {

		var id = $("#relational-summary-edit-id").val();

		if (input.entity != undefined && input.entity[id] != undefined) {

			input.entity[id].name = $("#relational-summary-edit-name").val();

		} else if (input.token != undefined && input.token[id] != undefined) {

			input.token[id].name = $("#relational-summary-edit-name").val();

		} else {



		}


		$("#relational-summary-edit-name").val("");
		$("#relational-summary-edit-id").val("");

		$("#relational-summary-edit-box").hide();

		save();


		$.each(trigger, function(i,o){

			o();

		});



	}

});

function relationalSummaryHijackControls(){


	var box = $("div[module='visual/video'] div.card-body");

	$("#relational-summary-canvas-container").after(box);
	$("div[module='visual/video']").addClass("invisible");
	$("div[module='visual/overlay']").addClass("invisible");

	// $("div[module='visual/video']").parent().addClass("offset-3");


	var element = $("div[module='relational/summary']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");			

	$("div[module='visual/video']").parent().css("height", height+"px");


}


function relationalSummaryPassive(data) {


	console.log(data);


	$("#relational-summary-canvas *").remove();

	if (data.entity != undefined) {

		$.each(data.entity, function(i,o){

			var meta = ""; //" (" + o.entity + ": " + + o.start + "%-" + o.end + "%)";

			if (data.position == undefined || data.position[o.id] == undefined) {

				var x = $("#relational-summary-canvas").outerWidth() * Math.random();
				var y = $("#relational-summary-canvas").outerHeight() * Math.random();

			} else {

				var x = data.position[o.id].x;
				var y = data.position[o.id].y;

			}


			relationalSummaryInsert(o.id, o.name, meta, "visual", x, y);


		});

	}


	if (data.token != undefined) {

		$.each(data.token, function(i,o){

			var meta = ""; //" (" + o.text + ")";

			if (data.position == undefined || data.position[o.id] == undefined) {

				var x = $("#relational-summary-canvas").outerWidth() * Math.random();
				var y = $("#relational-summary-canvas").outerHeight() * Math.random();

			} else {

				var x = data.position[o.id].x;
				var y = data.position[o.id].y;

			}


			relationalSummaryInsert(o.id, o.name, meta, "textual", x, y);


		});

	}

	if (data.connection != undefined) {

		$.each(data.connection, function(i,o){

			var array = i.split(":");

			var start = array[0];
			var end = array[1];


			var startObj = $("#relational-summary-canvas circle[index='"+start+"']");
			var endObj = $("#relational-summary-canvas circle[index='"+end+"']");

			var x1 = parseInt(startObj.attr("cx"));
			var x2 = parseInt(endObj.attr("cx"));

			var y1 = parseInt(startObj.attr("cy"));
			var y2 = parseInt(endObj.attr("cy"));


			if (x1 != -100 && x2 != -100 && y1 != -100 && y2 != -100) {

				var line = relationalSummaryInsertMakeSvg("line", {x1: x1, x2: x2, y1: y1, y2: y2, stroke: "#ccc", "stroke-width": 2, start: start, end: end});

				var canvas = $("#relational-summary-canvas")[0];
				canvas.prepend(line);

			}


		});


	}


	if ($("#relational-summary-canvas *").length == 0) {

		$("#relational-summary-instructions").text("No nodes available.");
		$("#relational-summary-instructions").removeClass("alert-info").addClass("alert-danger");

		$("#relational-summary-box").hide();

	}




}