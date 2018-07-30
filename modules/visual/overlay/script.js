callback.visualOverlay = function(){

	if (window.location.hostname.indexOf("cwc-view") > -1) {

		$("#visual-overlay-alert").hide();

	}

	if ($("#relational-summary-canvas-container").length > 0) {

		$("#visual-overlay-alert, #visual-overlay-fields").hide();

	}



	// var path = "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='visual/overlay']").attr("meta");


	// $.ajax({
	// 	url: path,
	// 	filetype: "text",
	// 	success: function(data){


	// 		if (!Array.isArray(data)) {

	// 	        data = JSON.parse(data);

	// 		}


	//         console.log(data);


	// 		if ($("#visual-bbox-timeline").length > 0) {



	// 			// data = JSON.parse(data);

	// 			// console.log(data);


	// 			var total = data.length - 1;

	// 			var timeline = {};



	// 			$.each(data, function(index,item){


	// 				if (item.tracked_people != undefined) {

	// 					var percentage = index / total;


	// 					$.each(item.tracked_people, function(j, person){

	// 						if (person._fmxnet_id != undefined) {


	// 							if (timeline[person._fmxnet_id] === undefined) {

	// 								timeline[person._fmxnet_id] = {};

	// 							}

	// 							timeline[person._fmxnet_id][index] = person;



	// 						} else if (person._utface_id != undefined) {



	// 							if (timeline[person._utface_id] === undefined) {

	// 								timeline[person._utface_id] = {};

	// 							}

	// 							timeline[person._utface_id][index] = person;


	// 						}


	// 					});

	// 				}


	// 			});

	// 			$("#visual-bbox-timeline").empty();


	// 			$.each(timeline, function(id, list){



	// 					$("#visual-bbox-timeline").append('<div class="position-relative list-group-item list-group-item-action border-left-0 border-right-0 position-relative" utf="'+id+'"><h6 class="position-absolute" style="left:5px; top:50%; margin-top:-0.5em; font-size:0.5rem">'+id+'</h6><div class="position-relative bg-light" style="height:10px;"><svg class="position-absolute w-100 h-100 border"></svg></div></div>');

	// 					var box = $("#visual-bbox-timeline div[utf='"+id+"'] svg")[0];

	// 					$.each(list, function(frame, item){


	// 						var percentage = frame / total * 100;

	// 						var shape = visualOverlaySVG("circle", { cx: percentage+"%", cy: 5, r:1, fill: "black", class: "position-absolute frame", frame: frame, utf: id, json: JSON.stringify(item) });

	// 						box.appendChild(shape);


	// 					});


	// 					var shape = visualOverlaySVG("circle", { cx: "0%", cy: 5, r:1, fill: "red", class: "position-absolute visual-overlay-cursor" });

	// 					box.appendChild(shape);






	// 			});

	// 			$("div[module='visual/overlay'] .metadata").html(data);

	// 			var element = $("div[module='visual/overlay']");
	// 			var height = element.find(".content").outerHeight();
	// 			element.css("height", height+"px");			


	// 			$("#visual-video-pane").attr("total", total);

	// 			animate.visualOverlay = function(){

	// 				visualOverlay();

	// 			}

	// 			visualOverlay();


	// 			$("#relational-summary-alert").hide();

	// 		}


	// 	} 
	// })

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




poll.visualOverlay = function(){

	if ($("#visual-bbox-timeline").attr("loading") == undefined) {

		var msg = "hello world";

		$("#visual-bbox-timeline").attr("loading", "true");

		var templateOriginal = $("#visual-bbox-timeline-template");

		$.ajax({
			url: "/modules/visual/overlay/list.php",
			data: {
				session: session_id
			},
			success: function(data){

				var list = JSON.parse(data);



				// $("#visual-bbox-timeline div.alert").hide();

				console.log(list);

				$.each(list, function(i,o){

					var template = templateOriginal.clone().removeAttr("id").show();

					if ($("#visual-bbox-timeline div[data-db='"+i+"']").length == 0) {


						if (o.data.ACTOR_NAME == null) {

							o.data.ACTOR_NAME = "";

						}

						console.log(o);

						var text = "";

						template.attr("data-db", i);
						template.attr("data-name", o.data.ACTOR_NAME);
						template.find("h6").text(o.data.ACTOR_NAME);







						$("#visual-bbox-timeline").append(template);

						// $("#visual-bbox-timeline").append(template);


					}



					$.each(o.overlays, function(j,p){

						console.log(p);

						// if ($("#visual-bbox-timeline div[data-db='"+i+"'] circle[db='"+j+"']").length == 0 && j != "") {

						var element = $("div.visual-bbox-bar[data-db='"+i+"'] svg");

						var bar = element[0];
						var position = element.outerWidth() * (p.TIME / 100);

						console.log(position);

						var x = p.X;
						var y = p.Y;
						var w = p.W;
						var h = p.H;



						var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 2, fill: "black", db: j, time: p.TIME, x: x, y: y, w: w, h:h});
						bar.appendChild(path);


						// }


					});


				});

				$("#visual-bbox-timeline").removeAttr("loading");


				return false;

				$("#cwc_actor_list tr[data-db]").each(function(){

					var id = $(this).data("db");



					if (cwcList[id] == undefined) {

						$(this).remove();

					} else {


						if (cwcList[id].ACTOR_NAME != $(this).find("td.name").text()) {

							$(this).find("td.name").text(cwcList[id].ACTOR_NAME);

						}

					}

				});

				$.each(cwcList, function(i,o){


					if ($("#cwc_actor_list tr[data-db='"+o.ACTOR_ID+"']").length == 0) {

						// console.log(o.RX);
						// console.log(o.RY);

						if (o.ACTOR_NAME == null) {

							o.ACTOR_NAME = "";

						}

						$("#cwc_actor_list").append('<tr data-asset="'+o.ASSET_ID+'" data-type="'+o.ASSET_TYPE_ID+'" data-db="'+o.ACTOR_ID+'"><th scope="row" class="align-middle">'+o.ACTOR_ID+'</th><td class="type align-middle">'+o.ASSET_NAME+'</td><td class="name  align-middle">'+o.ACTOR_NAME+'</td><td class=" align-middle"><input readonly class="form-control form-control-sm" style="width:80px" type="number" min="0" max="359.9" step="0.1" value="'+o.RX+'"></td><td class=" align-middle"><input readonly class="form-control form-control-sm" style="width:80px" type="number" min="0" max="359.9" step="0.1" value="'+o.RY+'"></td><td class="text-right align-middle"><i class="fa fa-tag text-success cwc_asset_attribute"></i> <i class="fa fa-pencil-alt text-primary cwc_asset_rename"></i> <i class="fa fa-times text-danger cwc_asset_remove"></i></td></tr>');

					}

				});


				if ($("#cwc_asset_mode a.active").length == 0) {

					$("#cwc_asset_mode a:first").click();

				} else {

					var type = $("#cwc_asset_mode a.active").data("type");

					$("#cwc_actor_list tr[data-type='"+type+"']").show();
					$("#cwc_actor_list tr[data-type!='"+type+"']").hide();


				}


				$("#cwc_actor_list").removeAttr("loading");
				cwcAssetResize();




			}
		});

	}

}


$(document).on("click", ".visual-bbox-insert", function(){


	var value = $("#visual-video-timeline").val();
	var element = $(this);

	// if ($(this).closest("div.visual-bbox-bar").find("circle[percentage='"+value+"']").length > 0) {

	// 	return false;

	// }

	var value = parseFloat($("#visual-video-timeline").val());

	// var percentage = value/100;

	var db = element.closest(".visual-bbox-bar").attr("data-db");

	var obj = {};
	obj.db = db;
	obj.time = value;

	console.log(obj);

	$.ajax({
		url: "/modules/visual/overlay/add.php",
		type: "POST",
		data: obj,		
		success: function(data){

			$.each(poll, function(i,o){

				o();

			});
			

		}
	});


	// var bar = $(this).closest("div.visual-bbox-bar").find("svg")[0];

	// var position = $(this).closest("div.visual-bbox-bar").find("svg").outerWidth() * percentage;

	// var index = $(this).closest("div.visual-bbox-bar").index();


	// if ($(".visual-bbox-canvas-box-placeholder[index='"+index+"']").length > 0 && parseInt($(".visual-bbox-canvas-box-placeholder[index='"+index+"']").attr("x")) > 0) {

	// 	var element = $(".visual-bbox-canvas-box-placeholder[index='"+index+"']");

	// 	var x = parseInt(element.attr("x"));
	// 	var y = parseInt(element.attr("y"));
	// 	var w = parseInt(element.attr("width"));
	// 	var h = parseInt(element.attr("height"));

	// } else {

	// 	var x = $("#visual-video-canvas").outerWidth() / 2 - 50;
	// 	var y = $("#visual-video-canvas").outerHeight() / 2 - 50;
	// 	var w = 100;
	// 	var h = 100;

	// }

	// var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 2, fill: "black", percentage: value, x: x, y: y, w: w, h:h});
	// bar.appendChild(path);


	// // var canvas = $("#visual-video-canvas")[0];

	// // var path = visualBboxInsertMakeSvg('rect', {x: 0, y: 0, w: 50, h:50, fill: "transparent", stroke: 'white', "stroke-width": 2});

	// // canvas.appendChild(path);


 //    var $wrapper = $(this).closest("div.visual-bbox-bar").find("svg"),
 //        $articles = $wrapper.find("circle");
 //    [].sort.call($articles, function(a,b) {
 //        return +parseFloat($(a).attr('percentage')) - +parseFloat($(b).attr('percentage'));
 //    });

 //    $articles.each(function(){
 //        $wrapper.append(this);
 //    });


	// visualBboxSave();

	// visualBboxDisplay();




});


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

	$("#visual-bbox-timeline div.list-group-item-action.list-group-item-danger").removeClass("list-group-item-danger");

	var tester = {};


	$.each(input.entity, function(i,p){

		if (tester[p.id] === undefined) {

			tester[p.id] = 0;

		}

	});

	$("#visual-bbox-timeline circle[frame='"+frame+"']").each(function(){

		var utf = parseInt($(this).attr("utf"));

		$("#visual-bbox-timeline div.list-group-item-action[utf='"+utf+"']").addClass("list-group-item-danger");


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
