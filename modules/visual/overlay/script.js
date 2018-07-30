callback.visualOverlay = function(){

	if (window.location.hostname.indexOf("cwc-view") > -1) {

		$("#visual-overlay-alert").hide();

	}

	if ($("#relational-summary-canvas-container").length > 0) {

		$("#visual-overlay-alert, #visual-overlay-fields").hide();

	}


	var path = "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='visual/overlay']").attr("meta");


	$.ajax({
		url: path,
		filetype: "text",
		success: function(data){


			if (!Array.isArray(data)) {

		        data = JSON.parse(data);

			}


	        console.log(data);


			if ($("#visual-overlay-group").length > 0) {



				// data = JSON.parse(data);

				// console.log(data);


				var total = data.length - 1;

				var timeline = {};



				$.each(data, function(index,item){


					if (item.tracked_people != undefined) {

						var percentage = index / total;


						$.each(item.tracked_people, function(j, person){

							if (person._fmxnet_id != undefined) {


								if (timeline[person._fmxnet_id] === undefined) {

									timeline[person._fmxnet_id] = {};

								}

								timeline[person._fmxnet_id][index] = person;



							} else if (person._utface_id != undefined) {



								if (timeline[person._utface_id] === undefined) {

									timeline[person._utface_id] = {};

								}

								timeline[person._utface_id][index] = person;


							}


						});

					}


				});

				$("#visual-overlay-group").empty();


				$.each(timeline, function(id, list){



						$("#visual-overlay-group").append('<div class="position-relative list-group-item list-group-item-action border-left-0 border-right-0 position-relative" utf="'+id+'"><h6 class="position-absolute" style="left:5px; top:50%; margin-top:-0.5em; font-size:0.5rem">'+id+'</h6><div class="position-relative bg-light" style="height:10px;"><svg class="position-absolute w-100 h-100 border"></svg></div></div>');

						var box = $("#visual-overlay-group div[utf='"+id+"'] svg")[0];

						$.each(list, function(frame, item){


							var percentage = frame / total * 100;

							var shape = visualOverlaySVG("circle", { cx: percentage+"%", cy: 5, r:1, fill: "black", class: "position-absolute frame", frame: frame, utf: id, json: JSON.stringify(item) });

							box.appendChild(shape);


						});


						var shape = visualOverlaySVG("circle", { cx: "0%", cy: 5, r:1, fill: "red", class: "position-absolute visual-overlay-cursor" });

						box.appendChild(shape);






				});

				$("div[module='visual/overlay'] .metadata").html(data);

				var element = $("div[module='visual/overlay']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");			


				$("#visual-video-pane").attr("total", total);

				animate.visualOverlay = function(){

					visualOverlay();

				}

				visualOverlay();


				$("#relational-summary-alert").hide();

			}


		} 
	})

}


function visualOverlaySVG(tag, attrs, text) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }


    if (text != undefined) {

	    el.innerHTML = text;

    }


    return el;
}


function visualOverlay(){

	var totalFrames = parseInt($("#visual-video-pane").attr("total")) - 1; 


	var pane = document.getElementById("visual-video-pane");

	var percentage = pane.currentTime / pane.duration * 100;

	if (!isNaN(percentage)) {

		$(".visual-overlay-cursor").attr("cx", percentage+"%");

	}


	var time = pane.currentTime / pane.duration * totalFrames;

	var frame = Math.round(time);

	console.log(frame);
	console.log("---");



	$("#visual-video-canvas>*").remove();



	var load_svg_selector = "visual-video-pane";

	var svg_width = $("#"+load_svg_selector).width();
	var svg_height = $("#"+load_svg_selector).height();

	var load_video_width = 480;
	var load_video_height = 204;


	var size = 12;
	var offset = 10;

	$("#visual-overlay-group div.list-group-item-action.list-group-item-danger").removeClass("list-group-item-danger");

	var tester = {};


	$.each(input.entity, function(i,p){

		if (tester[p.id] === undefined) {

			tester[p.id] = 0;

		}

	});

	$("#visual-overlay-group circle[frame='"+frame+"']").each(function(){

		var utf = parseInt($(this).attr("utf"));

		$("#visual-overlay-group div.list-group-item-action[utf='"+utf+"']").addClass("list-group-item-danger");


		var json = $(this).attr("json");
		json = JSON.parse(json);

		console.log(json);

		var canvas = $("#visual-video-canvas")[0];



		if (json.deeppose_data != undefined) {

			var array = json.deeppose_data;
			var i,j,temparray,chunk = 3;

			for (i=0,j=array.length; i<j; i+=chunk) {
			    temparray = array.slice(i,i+chunk);

			    if (temparray[0] != 0 && temparray[1] != 0 && temparray[2] != 0) {

			    	var x = temparray[0];
			    	var y = temparray[1];

					var top = y/load_video_height*svg_height
					var left = x/load_video_width*svg_width;

		    		var object = visualOverlaySVG('circle', {cx: left, cy: top, r:2, fill: "#fff", stroke: "transparent", type: 'deeppose_display_dot', index: utf});
					canvas.appendChild(object);

			    }

			}


		}

		var activeColor = "transparent";
		var activeClass = "";

		if (parseInt($("#visual-overlay-entity").val()) === utf) {

			activeColor = "rgba(245, 198, 203, 0.75)";
			activeClass = "active";

		}




		if (json.darknet_data != undefined && json.darknet_data.Bbox != undefined) {


			var o = json.darknet_data;

			var left = o.Bbox[0]/load_video_width*svg_width;
			var top = o.Bbox[1]/load_video_height*svg_height;
			var width = o.Bbox[2]/load_video_width*svg_width;
			var height = o.Bbox[3]/load_video_height*svg_height;

			var object = visualOverlaySVG('rect', {x: left, y: top, width: width, height: height, stroke: "#fff", index: utf, fill: "transparent"});
			canvas.appendChild(object);


		}


		if (json.utface_data != undefined && json.utface_data.ftrack_id != undefined) {

			var o = json.utface_data;

			var left = o.x/load_video_width*svg_width/2;
			var top = o.y/load_video_height*svg_height/2;
			var width = o.w/load_video_width*svg_width/2;
			var height = o.h/load_video_height*svg_height/2;

			var object = visualOverlaySVG('rect', {x: left, y: top, width: width, height: height, stroke: "#fff", index: utf, fill: "transparent"});
			canvas.appendChild(object);

		}

		if (json.fmxnet_data != undefined && json.fmxnet_data.length >= 2) {

			var o = json.fmxnet_data;

			var x = o[0][1]/load_video_width*svg_width;
			var y = o[0][0]/load_video_height*svg_height;
			var w = (o[1][1]-o[0][1])/load_video_width*svg_width;
			var h = (o[1][0]-o[0][0])/load_video_height*svg_height;

			var centerX = x + w / 2;
			var centerY = y + h / 2;

			var path = visualOverlaySVG('rect', {x: x, y: y, width: w, height: h, fill: activeColor, stroke: 'white', "stroke-width": 2, class: "visual-overlay-canvas-box "+activeClass, index: utf});		
			canvas.appendChild(path);

			object = visualOverlaySVG("text", {x: x+offset, y: y+offset, "font-size": 20, fill: "white", "text-anchor": "left", "alignment-baseline": "hanging", index: utf}, utf);
			canvas.appendChild(object);

			var textArray = [];

			$.each(o, function(a,b){

				if (a > 1) {

					var object = visualOverlaySVG("text", {x: x+offset + w, y: y+offset + (size*(a-2)*1.4), "font-size": size, fill: "white", "text-anchor": "left", "alignment-baseline": "hanging", index: utf}, b);
					canvas.appendChild(object);

				}

			});

		} else {

			if (json.darknet_data != undefined && json.darknet_data.Bbox != undefined) {


				var o = json.darknet_data;

				console.log(o);

				var x = o.Bbox[0]/load_video_width*svg_width;
				var y = o.Bbox[1]/load_video_height*svg_height;
				var w = o.Bbox[2]/load_video_width*svg_width;
				var h = o.Bbox[3]/load_video_height*svg_height;

				var centerX = x + w / 2;
				var centerY = y + h / 2;

				var path = visualOverlaySVG('rect', {x: x, y: y, width: w, height: h, fill: activeColor, stroke: 'white', "stroke-width": 2, class: "visual-overlay-canvas-box "+activeClass, index: utf});		
				canvas.appendChild(path);

				object = visualOverlaySVG("text", {x: x+offset, y: y+offset, "font-size": 20, fill: "white", "text-anchor": "left", "alignment-baseline": "hanging", index: utf}, utf);
				canvas.appendChild(object);


			}

		}




		$.each(input.entity, function(i,p){


			if (p.entity == utf) {


				if (input.hide[p.id] === undefined) {

					input.hide[p.id] = null;

				}

				input.hide[p.id] = false;


				if (input.position[p.id] === undefined) {

					input.position[p.id] = {};

				}

				input.position[p.id].x = centerX;
				input.position[p.id].y = centerY;



				tester[p.id]++;

			}

		});



	});
	

	if (input.hide === undefined) {

		input.hide = {};

	}

	$.each(tester, function(id, qty){

		if (qty == 0) {

			if (input.hide[id] === undefined) {

				input.hide[id] = null;

			}

			input.hide[id] = true;


			if (input.position[id] === undefined) {

				input.position[id] = {};

				input.position[id].x = input.video.w * Math.random();
				input.position[id].y = input.video.h * Math.random();

			}

		}

	});



	$.each(trigger, function(i,o){


		if (i != "relationalVisual") {

			o();

		}


	});



}





$(document).on("click", "#visual-overlay-clear", function(e){

	$("#visual-overlay-entity").val("");
	$("#visual-overlay-start").val("");
	$("#visual-overlay-end").val("");

	$("#visual-overlay-submit").removeClass("btn-primary").addClass("btn-danger");


});

$(document).on("click", "#visual-overlay-submit", function(e){

	if ($("#visual-overlay-entity").val() != "" && $("#visual-overlay-start").val() != "" && $("#visual-overlay-end").val() != "") {

		var obj = {};

		obj.id = (new Date().getTime()).toString(16);
		obj.name = "Entity "+String($("#visual-overlay-entity").val());
		obj.entity = parseInt($("#visual-overlay-entity").val());
		obj.start = parseFloat($("#visual-overlay-start").val());
		obj.end = parseFloat($("#visual-overlay-end").val());

		if (input.entity == undefined) {

			input.entity = {};

		}

		input.entity[obj.id] = obj;


		if (input.position == undefined) {

			input.position = {};

		}

		if (input.position[obj.id] == undefined) {

			input.position[obj.id] = {};

		}






		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		var x = $("#relational-summary-canvas").outerWidth() * (getRandomInt(20, 80) / 100);
		var y = $("#relational-summary-canvas").outerHeight() * (getRandomInt(20, 80) / 100);

		if ($("#visual-video-canvas rect[index='"+obj.entity+"']").length > 0) {

			x = parseFloat($("#visual-video-canvas rect[index='"+obj.entity+"']").attr("x"));
			y = parseFloat($("#visual-video-canvas rect[index='"+obj.entity+"']").attr("y"));
			w = parseFloat($("#visual-video-canvas rect[index='"+obj.entity+"']").attr("width"));
			h = parseFloat($("#visual-video-canvas rect[index='"+obj.entity+"']").attr("height"));

			x += w / 2;
			y += h / 2;

		}



		input.position[obj.id].x = x;
		input.position[obj.id].y = y;


		$("#visual-overlay-entity").val("");
		$("#visual-overlay-start").val("");
		$("#visual-overlay-end").val("");

		save();

		$.each(trigger, function(i,o){

			o();

		});

	} else {



	}


});

$(document).on("click", "rect.visual-overlay-canvas-box", function(e){

	if (window.location.hostname.indexOf("cwc-view") > -1) {

		return false;

	}

	var index = $(this).attr("index");
	var pane = document.getElementById("visual-video-pane");
	var time = (pane.currentTime / pane.duration * 100).toFixed(2);

	if ($("#visual-overlay-entity").val() === ""){

		$("#visual-overlay-entity").val(index).addClass("rubberBand");
		$("#visual-overlay-start").val("").removeClass("rubberBand");
		$("#visual-overlay-end").val("").removeClass("rubberBand");

	} else if ($("#visual-overlay-entity").val() !== index){

		$("#visual-overlay-entity").val(index).addClass("rubberBand");
		$("#visual-overlay-start").val("").removeClass("rubberBand");
		$("#visual-overlay-end").val("").removeClass("rubberBand");

		$("#relational-visual-table tr.table-danger").remove();

	}

	if ($("#visual-overlay-start").val() !=="" && $("#visual-overlay-end").val() !== ""){

		$("#visual-overlay-start").val("").removeClass("rubberBand");
		$("#visual-overlay-end").val("").removeClass("rubberBand");

	} else {


		if ($("#visual-overlay-start").val() === ""){

			$("#visual-overlay-start").val(time).addClass("rubberBand");

		} else {

			$("#visual-overlay-end").val(time).addClass("rubberBand");



		}



	}

	if ($("#visual-overlay-entity").val() != "") {

		$("#relational-visual-table").append('<tr class="table-danger"><th scope="row" class="">'+$("#visual-overlay-entity").val()+'</th><td>?</td><td class="">'+$("#visual-overlay-start").val()+'</td><td class="text-center">'+"?"+'</td><td><button class="btn btn-danger btn-sm relational-visual-cancel"><i class="fa fa-times"></i></button></td></tr>');
	
		$("#relational-visual-list-box").scrollTop(1000000);




	} else {



	}


	if ($("#visual-overlay-entity").val() != "" && $("#visual-overlay-start").val() != "" && $("#visual-overlay-end").val() != "") {

		$("#visual-overlay-submit").removeClass("btn-danger").addClass("btn-primary");
		$("#visual-overlay-submit").click();

	} else {

		$("#visual-overlay-submit").removeClass("btn-primary").addClass("btn-danger");


	}

	visualOverlay();

});
