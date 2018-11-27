callback.visualOverlay = function(){

	if (window.location.hostname.indexOf("cwc-view") > -1) {

		$("#visual-overlay-alert").hide();

	}

	if ($("#relational-summary-canvas-container").length > 0) {

		$("#visual-overlay-alert, #visual-overlay-fields").hide();

	}



	var meta = $("div[module='visual/overlay']").attr("meta");

	// if (meta == "MIT") {

	// 	$("#visual-bbox-timeline-template button").prop("disabled", true);
	// 	$("#visual_overlay_guide").html("<i class='fa fa-info-circle'></i> View Mode Only")
	// }

	// $.ajax({
	// 	url: path,
	// 	filetype: "text",
	// 	success: function(data){


	// 		if (!Array.isArray(data)) {

	// 	        data = JSON.parse(data);

	// 		}


	//         //console.log(data);


	// 		if ($("#visual-bbox-timeline").length > 0) {



	// 			// data = JSON.parse(data);

	// 			// //console.log(data);


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

animate.visualOverlay = function(data){


	var time = $("#visual-video-timeline").val();


	$("#visual-video-canvas").empty();

	$("div.visual-bbox-bar circle[time='"+time+"']").each(function(){


		var label = $(this).closest("div.visual-bbox-bar").find("h6").text();
		// var index = 

		var color = $(this).closest("div.visual-bbox-bar").find("button:first").css("background-color");


		var points = JSON.parse($(this).attr("points"));
		var db = $(this).attr("db");



		var svg = $("#visual-video-canvas")[0];


		var points2 = [];

		$.each(points, function(i, o){


			var item = {};
			item.db = o.db;
			item.hide = o.hide;
			item.x = parseFloat(o.position[0]);
			item.y = parseFloat(o.position[1]);

			points2.push(item);

		});

		var vertices = points2;


	 	var radius = 10;
	 	var strokeWidth = 2;
	 	var fill = "black";

		var meta = $("div[module='visual/overlay']").attr("meta");


	 	if (meta == 'MIT' || meta == "FIGURE" || meta == "OUTLINE") {

	 		radius = 3;
	 		strokeWidth = 1;
	 		fill = "black";

	 	} else if (meta == "POSE") {

	 		radius = 5;
	 		strokeWidth = 1;
	 		fill = "black";

	 	}




		$.each(vertices, function(i, o){

			var path = visualBboxInsertMakeSvg('circle', {index: i, overlay: db, cx: o.x+"%", cy: o.y+"%", r: radius, stroke:"white", "stroke-width": strokeWidth, fill: fill, db: o.db, hide: o.hide});
			svg.appendChild(path);

		});



		if (vertices.length > 2 && vertices.length != 18 && meta != 'POSE') {


			var list = [];
			var reference = [];

			var points = [];


			var areas = [];
			var areas_points = {};
			var reference = [];
			var queue = [];
			var indices = {};


			$.each(vertices, function(i,o){

				o.x = $("#visual-video-canvas").outerWidth() * o.x / 100;
				o.y = $("#visual-video-canvas").outerHeight() * o.y / 100;

				var text = o.x+" "+o.y;
				points.push(text);


				// var item = [o.x, o.y];

				// list.push(item);
				// reference.push(item);

				var area = o.x * o.y;
				areas_points[area] = [o.x, o.y];
				reference.push([o.x, o.y]);
				queue.push([o.x, o.y]);

				areas.push(area);
				indices[area] = i;


			});

			areas.sort(function(a,b) { return a - b;});

			// //console.log(areas);

			var leftmost = areas[0];


			var count = 0;
			var target = reference.length;

			var reference = [];

			var firstpoint = areas_points[leftmost];

			var now = null;
			var next = indices[leftmost];

			// //console.log(indices);
			////console.log(queue);
			// //console.log(next);


			var points = [];

			var o = {};

			o.x = $("#visual-video-canvas").outerWidth() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"']:not(.marked):first").attr("cx").replace("%", "")) / 100;
			o.y = $("#visual-video-canvas").outerHeight() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"']:not(.marked):first").attr("cy").replace("%", "")) / 100;

			var text = o.x+" "+o.y;
			points.push(text);

			$("#visual-video-canvas circle[overlay='"+db+"']:not(.marked):first").addClass("next");


			function iterate(){

				var overlay = db;

				var target = $("#visual-video-canvas circle[overlay='"+overlay+"']").length;
				var count = $("#visual-video-canvas circle[overlay='"+overlay+"'].marked").length;

				if (count == target - 1) {

					// alert("Hooray");

					// //console.log(points);

					var pointString = points.join(" ");

					var meta = $("div[module='visual/overlay']").attr("meta");

					if (meta != "POSE") {

						var path = visualBboxInsertMakeSvg('polygon', {overlay: db, points: pointString, stroke: "white", "stroke-width": 2, fill: color});
						svg.appendChild(path);

					}




					return false;

				}

				var mark = $("#visual-video-canvas circle[overlay='"+overlay+"']:not(.marked).next");
				mark.addClass("marked").removeClass("next");

				var x0 = parseFloat(mark.attr("cx").replace("%", ""));
				var y0 = parseFloat(mark.attr("cy").replace("%", ""));


				var coordinates = {};
				var keys = [];

				$("#visual-video-canvas circle[overlay='"+overlay+"']:not(.marked)").each(function(){

					var id = $(this).attr("db");
					var x1 = parseFloat($(this).attr("cx").replace("%", ""));
					var y1 = parseFloat($(this).attr("cy").replace("%", ""));

					var xd = Math.abs(x0 - x1);
					var yd = Math.abs(y0 - y1);

					var zd = Math.sqrt(xd * xd + yd * yd);					

					coordinates[zd] = id;
					keys.push(zd);

				});


				keys.sort(function(a,b) { return a - b;});
				var index = keys[0];

				$("#visual-video-canvas circle[overlay='"+db+"'][db='"+coordinates[index]+"']:not(.marked)").addClass("next");

				var o = {};

				o.x = $("#visual-video-canvas").outerWidth() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"'][db='"+coordinates[index]+"']").attr("cx").replace("%", "")) / 100;
				o.y = $("#visual-video-canvas").outerHeight() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"'][db='"+coordinates[index]+"']").attr("cy").replace("%", "")) / 100;

				var text = o.x+" "+o.y;
				points.push(text);

				iterate();

				setTimeout(function(){


				}, 0);



				// //console.log(queue);

				// $.each(queue, function(i,o){

				// 	// //console.log(o);
				// 	// //console.log(next);

				// 	if (o != undefined && i == next) {



				// 		now = i;
				// 		queue[i] = undefined;

				// 		// //console.log(i);
				// 		// //console.log(now);

				// 		return false;

				// 	}

				// });

				// //console.log(now);

				// now = null;

				// count++;
				// //console.log(count);

				// iterate();

			}


			iterate();



			// var pointIndex = 0;


			// while (reference.length > 0) {

			// 	var selected = null;

			// 	$.each(reference, function(i,o){

			// 		if (o != undefined) {

			// 			selected = o;
			// 			return false;

			// 		}

			// 	});

			// 	//console.log(selected);



			// 	return false;

			// 	reference.splice(0, 1);
			// 	//console.log(pointIndex);
			// 	pointIndex++;




			// }




			// function findNearest(item){

			// 	var numbers = {};
			// 	var keys = [];
			// 	var indices = [];

			// 	var x0 = item[0];
			// 	var y0 = item[1];

			// 	$.each(reference, function(i,o){

			// 		var x1 = o[0];
			// 		var y1 = o[1];

			// 		var xd = Math.abs(x0 - x1);
			// 		var yd = Math.abs(y0 - y1);

			// 		var zd = Math.sqrt(xd * xd + yd * yd);

			// 		numbers[zd] = [x1, y1];
			// 		keys.push(zd);

			// 		indices[zd] = i;

			// 	});


			// 	keys.sort(function(a,b) { return a - b;});

			// 	//console.log("COMPARING "+x0+" AND "+y0+ " TO...");
			// 	//console.log(numbers);
			// 	//console.log(keys);


			// 	var index = keys[1];


			// 	// //console.log(numbers[index]);
			// 	// //console.log()

			// 	//console.log("FOUND!");
			// 	// //console.log(index);
			// 	//console.log(numbers);

			// 	return numbers;



			// }


			// var initial = list[0];

			// //console.log("START");
			// //console.log(initial);


			// $.each(list, function(i,o){

			// 	var item = list[0];
			// 	var comparison = findNearest(item);

			// 	//console.log(comparison);


			// });


			// //console.log(reference);

			// var points = [];
			// var pointsHull = [];
			// var fullList = [];

			// $.each(vertices, function(i,o){

			// 	o.x = $("#visual-video-canvas").outerWidth() * o.x / 100;
			// 	o.y = $("#visual-video-canvas").outerHeight() * o.y / 100;

			// 	var text = o.x+" "+o.y;
			// 	points.push(text);


			// 	var pointsHullItem = [o.x, o.y];

			// 	pointsHull.push(pointsHullItem);
			// 	fullList.push(pointsHullItem);

			// });



			// function findNearest(x0,y0){

			// 	var numbers = {};
			// 	var keys = [];
			// 	var indices = [];

			// 	$.each(fullList, function(i,o){

			// 		var x1 = o[0];
			// 		var y1 = o[1];

			// 		var xd = Math.abs(x0 - x1);
			// 		var yd = Math.abs(y0 - y1);

			// 		var zd = Math.sqrt(xd * xd + yd * yd);

			// 		numbers[zd] = [x1, y1];
			// 		keys.push(zd);

			// 		indices[zd] = i;

			// 	});


			// 	keys.sort(function(a,b) { return a - b;});

			// 	//console.log("COMPARING "+x0+" AND "+y0+ " TO...");
			// 	//console.log(numbers);
			// 	//console.log(keys);


			// 	var index = keys[1];


			// 	// //console.log(numbers[index]);
			// 	// //console.log()

			// 	//console.log("FOUND!");
			// 	// //console.log(index);
			// 	// //console.log(indices);
			// 	//console.log(indices[index]);
			// 	//console.log(numbers[index]);


			// 	return indices[index];



			// }


			// var processed = [];

			// //console.log(pointsHull);

			// // STARTING POINT
			// var initial = pointsHull[0];

			// processed.push(initial);

			// //console.log("STARTING WITH ...");
			// //console.log(initial);


			// while (pointsHull.length > 0) {

			// 	pointsHull.splice(0, 1);





			// 	//console.log("TEST");



			// 	////console.log("TEST");

			// }

			// // $.each(pointsHull, function(i,o){

			// // 	var x = o[0];
			// // 	var y = o[1];

			// // 	var index = findNearest(x, y, fullList);
			// // 	//console.log(index);


			// // });

			// // processed.push(initial);


			// // //console.log("---");
			// // //console.log(processed);




			// // var processed = hull(pointsHull, 100);

			// var points = [];

			// $.each(processed, function(i,o){

			// 	points.push(o[0]+" "+o[1]);

			// });


			// //console.log(points);




		} else if (vertices.length == 18 && meta == "POSE") {

			var poseList = [
				[0, 1],
				[1, 8],
				[8, 9],
				[9, 10],
				[1, 11],
				[11, 12],
				[12, 13],
				[1, 2],
				[2, 3],
				[3, 4],		
				[1, 5],
				[5, 6],
				[6, 7],	
				[0, 15],
				[15, 17],
				[0, 14],
				[14, 16],				
			];

			$.each(poseList, function(i,o){


				if ($("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"'][hide='0']").length > 0 && $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"'][hide='0']").length > 0) {

					var x1 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"']").attr("cx");
					var y1 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"']").attr("cy");
					var x2 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"']").attr("cx");
					var y2 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"']").attr("cy");

					//console.log(x1);
					//console.log(y1);

					var path = visualBboxInsertMakeSvg('line', {overlay: db, x1: x1, y1: y1, x2: x2, y2: y2, index: o[0]+"-"+o[1], class: "skeleton"});
					svg.appendChild(path);

				}


			});



		} else {


			var rect = generateRect(vertices[0].x, vertices[1].x, vertices[0].y, vertices[1].y);

			var meta = $("div[module='visual/overlay']").attr("meta");

			if (meta != "POSE") {

				var path = visualBboxInsertMakeSvg('rect', {overlay: db, width: rect.w+"%", height: rect.h+"%", x: rect.x+"%", y: rect.y+"%", stroke: "white", "stroke-width": 2, fill: color});
				svg.appendChild(path);
		
			}
		}


	});

	// if ($("#visual-bbox-timeline div.visual-bbox-bar circle[time='"+time+"']").length == 0) {

		// return false;

		$("#visual-bbox-timeline div.visual-bbox-bar").each(function(){

			var db = $(this).attr("data-db");
			var color = $(this).find("button:first").css("background-color");

			if ($(this).find("circle").length <= 1) {

				//return false;

			}

			var times = [];

			var timesDB = {};

			$(this).find("circle").each(function(i,o){

				times.push(parseInt($(this).attr("time")));
				timesDB[$(this).attr("time")] = $(this).attr("db");

			});


			var element = $(this);

			times.sort(function(a, b){return a-b});

			var middle = false;
			var startFrame = null;
			var startDB = null;
			var endFrame = null;
			var endDB = null;
			var ratio = null;

			var range = null;
			var fraction = null;

			if (times.length >= 2) {

				$.each(times, function(i, o){


					if (time > times[i] && time < times[i+1]) {


						// //console.log(db);


						element.find("line[start][end]").each(function(){

							var start = parseInt($(this).attr("start"));
							var end = parseInt($(this).attr("end"));

							if (start <= time && end >= time) {

								middle = true;



								startFrame = times[i];
								endFrame = times[i+1];

								startDB = timesDB[startFrame];
								endDB = timesDB[endFrame];

								ratio = (time - startFrame) / (endFrame - startFrame);


								range = endFrame - startFrame + 1;

								fraction = range / parseInt($("#visual-video-timeline").attr("max"));

								return false;


							}

						});



						// //console.log("MIDDLE: "+times[i] + " - " +  time + " - " + times[i+1] + " RANGE (" + range + " - " + fraction +")");



					}


				})


			}


			// //console.log(db);
			// //console.log(middle);
			// //console.log(startFrame + "("+startDB+") - " +  time + " - " + endFrame + "("+endDB+")");

			var write = false;

			if ($("div[module='visual/overlay']").attr("meta") != "POSE") {		

				if (middle = true && startFrame != null && endFrame != null) {

					var startPoints = $("#visual-bbox-timeline div.visual-bbox-bar circle[db='"+startDB+"']").attr("points");
					var endPoints = $("#visual-bbox-timeline div.visual-bbox-bar circle[db='"+endDB+"']").attr("points");

					var startPointsArray = JSON.parse(startPoints);
					var endPointsArray = JSON.parse(endPoints);

					// //console.log(startPointsArray);
					// //console.log(endPointsArray);

					var startRect = generateRect(startPointsArray[0].position[0], startPointsArray[1].position[0], startPointsArray[0].position[1], startPointsArray[1].position[1]);
					var endRect = generateRect(endPointsArray[0].position[0], endPointsArray[1].position[0], endPointsArray[0].position[1], endPointsArray[1].position[1]);


					var x = parseFloat(endRect.x - startRect.x);
					var y = parseFloat(endRect.y - startRect.y);
					var w = parseFloat(endRect.w - startRect.w);
					var h = parseFloat(endRect.h - startRect.h);


					// //console.log(startRect);
					// //console.log(endRect);
					// //console.log(ratio);

					var obj = {};
					obj.x = startRect.x + (ratio * x);
					obj.y = startRect.y + (ratio * y);
					obj.w = startRect.w + (ratio * w);
					obj.h = startRect.h + (ratio * h);

					// //console.log(obj);

					var svg = $("#visual-video-canvas")[0];

					write = true;


					if (fraction > 0.25) {

						opacity = 0;

					} else {


						opacity = 0.5* Math.pow(1 - fraction, 2);

						if (opacity < 0.05) {

							opacity = 0.05;

						}

					}


					// //console.log("INSERTED");


				} else if (time > times[times.length-1] && times.length >= 1) {

					// var endDB = timesDB[times[times.length-1]]

					// // //console.log("MAX");
					// var endPoints = $("#visual-bbox-timeline div.visual-bbox-bar circle[db='"+endDB+"']").attr("points");
					// var endPointsArray = JSON.parse(endPoints);
					// var obj = generateRect(endPointsArray[0].position[0], endPointsArray[1].position[0], endPointsArray[0].position[1], endPointsArray[1].position[1]);

					// var svg = $("#visual-video-canvas")[0];

					// write = true;

					// opacity = 0;


				}

				if (write == true) {

					var object = visualBboxInsertMakeSvg('rect', {fill: color, x: obj.x+"%", y: obj.y+"%", width: obj.w+"%", height: obj.h+"%", stroke: "#fff", overlay: db, class: "ghost", opacity: opacity});
					svg.appendChild(object);

				}


			} else {

				var dots = [];

				if (middle = true && startFrame != null && endFrame != null) {

					var startPoints = $("#visual-bbox-timeline div.visual-bbox-bar circle[db='"+startDB+"']").attr("points");
					var endPoints = $("#visual-bbox-timeline div.visual-bbox-bar circle[db='"+endDB+"']").attr("points");

					var startPointsArray = JSON.parse(startPoints);
					var endPointsArray = JSON.parse(endPoints);


					for (var i = 0; i < 18; i++) {

						var temp = {};

						var middleX = parseFloat(startPointsArray[i].position[0]) + ((parseFloat(endPointsArray[i].position[0]) - parseFloat(startPointsArray[i].position[0])) * ratio);
						var middleY = parseFloat(startPointsArray[i].position[1]) + ((parseFloat(endPointsArray[i].position[1]) - parseFloat(startPointsArray[i].position[1])) * ratio);

						temp.x = middleX;
						temp.y = middleY;
						temp.hide = startPointsArray[i].hide;

						dots.push(temp);

					}


					var svg = $("#visual-video-canvas")[0];

					write = true;
					opacity = 0.05;



				} else if (time > times[times.length-1] && times.length >= 1) {

					// var endDB = timesDB[times[times.length-1]]

					// var endPoints = $("#visual-bbox-timeline div.visual-bbox-bar circle[db='"+endDB+"']").attr("points");
					// var endPointsArray = JSON.parse(endPoints);


					// for (var i = 0; i < 18; i++) {

					// 	var temp = {};

					// 	var middleX = parseFloat(endPointsArray[i].position[0]);
					// 	var middleY = parseFloat(endPointsArray[i].position[1]);

					// 	temp.x = middleX;
					// 	temp.y = middleY;
					// 	temp.hide = endPointsArray[i].hide;

					// 	dots.push(temp);

					// }

					// write = true;
					// opacity = 0.05;

					// var svg = $("#visual-video-canvas")[0];



				}

				if (write == true) {

					//console.log(dots);

					$.each(dots, function(i,o){

						var path = visualBboxInsertMakeSvg('circle', {index: i, overlay: db, cx: o.x+"%", cy: o.y+"%", r: 5, stroke:"white", "stroke-width": 2, fill: "red", hide: o.hide, temp: "true", class: "ghost"});
						svg.appendChild(path);

					});

					var poseList = [
						[0, 1],
						[1, 8],
						[8, 9],
						[9, 10],
						[1, 11],
						[11, 12],
						[12, 13],
						[1, 2],
						[2, 3],
						[3, 4],		
						[1, 5],
						[5, 6],
						[6, 7],	
						[0, 15],
						[15, 17],
						[0, 14],
						[14, 16],				
					];

					$.each(poseList, function(i,o){

						//var db = overlay;


						if ($("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"'][hide='0']").length > 0 && $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"'][hide='0']").length > 0) {

							var x1 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"']").attr("cx");
							var y1 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"']").attr("cy");
							var x2 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"']").attr("cx");
							var y2 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"']").attr("cy");

							//console.log(x1);
							//console.log(y1);

							var path = visualBboxInsertMakeSvg('line', {overlay: db, x1: x1, y1: y1, x2: x2, y2: y2, index: o[0]+"-"+o[1], class: "skeleton ghost"});
							svg.appendChild(path);

						}



					});


				}


			}


		});


	// }

	$("#visual-video-canvas rect, #visual-video-canvas polygon, #visual-video-canvas line").each(function(){

		$("#visual-video-canvas").prepend($(this));
		
	})



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




var visualOverlayData = {};



static.visualOverlay = function(data){

	var meta = $("div[module='visual/overlay']").attr("meta");

	if ($("#visual-bbox-timeline").attr("loading") == undefined && visual_overlay_point_active == false) {

		var msg = "hello world";

		$("#visual-bbox-timeline").attr("loading", "true");

		var templateOriginal = $("#visual-bbox-timeline-template");

		var currentOverlays = {};

		var post = {};
		post.session = session_id

		if (data != undefined) {

			//console.log(data);

			post.db = data.db;
			post.time = data.time;

		}

		post.meta = meta;

		$.ajax({
			url: "/modules/visual/overlay/list.php",
			data: post,
			success: function(data){

				$("#visual-overlay-loading").hide();

				// if (visual_overlay_point_active == true) {

				// 	return false;

				// }

				var count = 0;

				var list = JSON.parse(data);

				// $("#visual-bbox-timeline div.alert").hide();

				//console.log(list);

				$.each(list, function(i,o){

					var template = templateOriginal.clone().removeAttr("id").show();
					count++;

					if ($("#visual-bbox-timeline div[data-db='"+i+"']").length == 0) {



						if (o.data.ACTOR_NAME == null) {

							o.data.ACTOR_NAME = "";

						}

						// //console.log(o);

						var text = "";

						template.attr("data-db", i);
						template.attr("data-name", o.data.ACTOR_NAME);
						template.find("h6").html((o.data.ACTOR_ID_ALT)+": "+o.data.ACTOR_NAME);







						$("#visual-bbox-timeline").append(template);

						// $("#visual-bbox-timeline").append(template);


					} else {

						// alert("Already exists "+i);


						$("#visual-bbox-timeline div[data-db='"+i+"']").find("h6").html((o.data.ACTOR_ID_ALT)+": "+o.data.ACTOR_NAME);



					}



					$.each(o.tweens, function(j,p){

						var p = p.data;

						if ($("div.visual-bbox-bar[data-db='"+i+"'] line[db='"+j+"']").length == 0) {

							var element = $("div.visual-bbox-bar[data-db='"+i+"'] svg");
							var bar = element[0];

							var position = $("#visual-video-dots").outerWidth() * (parseInt(p.ORDER) / parseInt($("#visual-video-timeline").attr("max")));

							var position2 = $("#visual-video-dots").outerWidth() * ((parseInt(p.ORDER) + parseInt(p.LENGTH)) / parseInt($("#visual-video-timeline").attr("max")));

							var path = visualBboxInsertMakeSvg('line', {x1: position, y1: 5, x2: position2, y2: 5, stroke:"black", "stroke-width": 1, opacity: 0.5, fill: "black", db: p.INTERACTION_ID, start: parseInt(p.ORDER), end: parseInt(p.ORDER) + parseInt(p.LENGTH)});
							bar.appendChild(path);

						};



					});



					$.each(o.overlays, function(j,p){

						// //console.log(j);
						// //console.log(p);

						currentOverlays[j] = p;

						var points = p.points;
						var p = p.data;

						if ($("div.visual-bbox-bar[data-db='"+i+"'] circle[db='"+j+"']").length == 0) {

							var element = $("div.visual-bbox-bar[data-db='"+i+"'] svg");

							// //console.log(element.outerWidth());

							var bar = element[0];

							// alert(element.outerWidth());

							var position = $("#visual-video-dots").outerWidth() * (p.TIME / parseInt($("#visual-video-timeline").attr("max")));

							// //console.log("---");
							// //console.log(p.TIME);
							// //console.log($("#visual-video-timeline").attr("max"));
							// //console.log(position);
							// //console.log("---");

							var h = p.H;

							var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 3, db: p.OVERLAY_ID, time: p.TIME, points: JSON.stringify(points), pointCount: points.length});
							bar.appendChild(path);



							$.each(animate, function(k,q){

								q();

							});

						}

						if ($("#visual-video-dots circle[time='"+p.TIME+"']").length == 0) {

							var element = $("#visual-video-dots");
							var bar = element[0];

							var position = element.outerWidth() * (p.TIME / $("#visual-video-timeline").attr("max"));

							var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 5, stroke:"white", "stroke-width": 0, fill: "black", time: p.TIME});
							bar.appendChild(path);


						}


					});


				});


				$("#visual-bbox-timeline").removeAttr("loading");



				// $("#cwc_actor_list tr[data-db]").each(function(){

				// 	var id = $(this).data("db");



				// 	if (cwcList[id] == undefined) {

				// 		$(this).remove();

				// 	} else {


				// 		if (cwcList[id].ACTOR_NAME != $(this).find("td.name").text()) {

				// 			$(this).find("td.name").text(cwcList[id].ACTOR_NAME);

				// 		}

				// 	}

				// });

				// $.each(cwcList, function(i,o){


				// 	if ($("#cwc_actor_list tr[data-db='"+o.ACTOR_ID+"']").length == 0) {

				// 		// //console.log(o.RX);
				// 		// //console.log(o.RY);

				// 		if (o.ACTOR_NAME == null) {

				// 			o.ACTOR_NAME = "";

				// 		}

				// 		$("#cwc_actor_list").append('<tr data-asset="'+o.ASSET_ID+'" data-type="'+o.ASSET_TYPE_ID+'" data-db="'+o.ACTOR_ID+'"><th scope="row" class="align-middle">'+o.ACTOR_ID+'</th><td class="type align-middle">'+o.ASSET_NAME+'</td><td class="name  align-middle">'+o.ACTOR_NAME+'</td><td class=" align-middle"><input readonly class="form-control form-control-sm" style="width:80px" type="number" min="0" max="359.9" step="0.1" value="'+o.RX+'"></td><td class=" align-middle"><input readonly class="form-control form-control-sm" style="width:80px" type="number" min="0" max="359.9" step="0.1" value="'+o.RY+'"></td><td class="text-right align-middle"><i class="fa fa-tag text-success cwc_asset_attribute"></i> <i class="fa fa-pencil-alt text-primary cwc_asset_rename"></i> <i class="fa fa-times text-danger cwc_asset_remove"></i></td></tr>');

				// 	}

				// });


				// if ($("#cwc_asset_mode a.active").length == 0) {

				// 	$("#cwc_asset_mode a:first").click();

				// } else {

				// 	var type = $("#cwc_asset_mode a.active").data("type");

				// 	$("#cwc_actor_list tr[data-type='"+type+"']").show();
				// 	$("#cwc_actor_list tr[data-type!='"+type+"']").hide();


				// }


				// $("#cwc_actor_list").removeAttr("loading");
				// cwcAssetResize();




				var element = $("div[module='visual/overlay']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");

			}
		});




	}

}


$(document).on("click", "div.visual-bbox-bar circle", function(){


	var time = $(this).attr("time");

	var pane = document.getElementById("visual-video-pane");
	pane.pause();

	$("#visual-video-timeline").val(time).trigger("input");




});



$(document).on("click", ".visual-bbox-remove", function(){

	var circle = $(this).closest("div.visual-bbox-bar").find("circle.active");
	var db = circle.attr("db");
	var time = circle.attr("time");

	var obj = {};
	obj.db = db;

	obj.actor = $(this).closest("div.visual-bbox-bar").attr("data-db");
	obj.time = time;

	var element = $(this).closest("div.visual-bbox-bar");

	$.ajax({
		url: "/modules/visual/overlay/remove.php",
		type: "POST",
		data: obj,		
		success: function(data){

			circle.remove();
			// $("#visual-video-dots *").remove();

			element.find("line[start='"+time+"'], line[end='"+time+"']").remove();

			$("#visual-video-dots circle[time='"+time+"']").remove();


			$.each(animate, function(k,q){

				q();

			});

			$.each(static, function(i,o){

				o();

			});
			

		}
	});

});

$(document).on("click", ".visual-bbox-hide", function(){

	var element = $(this);
	var db = element.closest(".visual-bbox-bar").attr("data-db");
	var value = $("#visual-video-timeline").val();

	if (element.closest(".visual-bbox-bar").find("circle[time='"+value+"']").length > 0) {

		var dot = element.closest(".visual-bbox-bar").find("circle[time='"+value+"']");

		var rect = JSON.parse(dot.attr("points"));
		var overlay_id = dot.attr("db");


		$.ajax({
			url: "/modules/visual/overlay/move.php",
			type: "POST",
			data: {
				db: rect[0].db,
				x: 0,
				y: 0
			},
			success: function(data){

				$.ajax({
					url: "/modules/visual/overlay/move.php",
					type: "POST",
					data: {
						db: rect[1].db,
						x: 0,
						y: 0
					},
					success: function(data){

						$("div.visual-bbox-bar circle[db='"+overlay_id+"']").remove();

						var obj = {};
						obj.db = db;
						obj.time = value;


						$.each(static, function(i,o){

							o(obj);

						});


					}


				});

			}

		});		

	} else {





			var obj = {};
			obj.db = db;
			obj.time = value;
			obj.x0 = 0;
			obj.y0 = 0;
			obj.x1 = 0;
			obj.y1 = 0;

			$.ajax({
				url: "/modules/visual/overlay/add.php",
				type: "POST",
				data: obj,		
				success: function(data){


					$.each(static, function(i,o){

						o(obj);

					});


				}
			});		

						


	}

});

var curX = null;
var curY = null;

$(document).on("mousemove", $("#visual-video-canvas"), function(e){


	curY = (e.pageY - $("#visual-video-canvas").position().top) / $("#visual-video-canvas").outerHeight() * 100;
	curX = (e.pageX - $("#visual-video-canvas").position().left) / $("#visual-video-canvas").outerWidth() * 100;


});

$(document).on("click", ".visual-bbox-insert", function(e){


	var value = $("#visual-video-timeline").val();
	var element = $(this);
	// var type = element.attr("data-type");

	// if ($(this).closest("div.visual-bbox-bar").find("circle[percentage='"+value+"']").length > 0) {

	// 	return false;

	// }


	var value = parseInt($("#visual-video-timeline").val());

	// var percentage = value/100;

	var db = element.closest(".visual-bbox-bar").attr("data-db");

	var obj = {};

	// obj.type = type;
	

	if ($("#visual-video-canvas rect[overlay='"+db+"'].ghost").length > 0) {

		//alert("Hello");
		obj.db = db;
		obj.time = value;
		var rect = $("#visual-video-canvas rect[overlay='"+db+"']");

		obj.x0 = rect.attr("x").replace("%", "");
		obj.y0 = rect.attr("y").replace("%", "");
		obj.x1 = parseFloat(obj.x0) + parseFloat(rect.attr("width").replace("%", ""));
		obj.y1 = parseFloat(obj.y0) + parseFloat(rect.attr("height").replace("%", ""));



		$.ajax({
			url: "/modules/visual/overlay/add.php",
			type: "POST",
			data: obj,		
			success: function(data){

				$.each(static, function(i,o){

					o(obj);

				});
		
				$("#visual-video-timeline").val(value).trigger("input");
				

			}
		});






	} else {


		if ($("div.visual-bbox-bar[data-db='"+db+"'] circle.active").length > 0) {


			if ($("div.module[module='visual/overlay']").attr("meta") == "POSE") {

				return false;

			};


			var overlay = $("div.visual-bbox-bar[data-db='"+db+"'] circle.active").attr("db");

			obj.db = overlay;
			obj.time = value;

			obj.x = curX;
			obj.y = curY;

			if (curX > 100 || curY > 100) {

				return false;

			}


			$.ajax({
				url: "/modules/visual/overlay/add_point.php",
				type: "POST",
				data: obj,		
				success: function(data){



					var obj = {};
					obj.db = db;
					obj.time = value;

					$("div.visual-bbox-bar circle[db='"+overlay+"']").remove();

					$.each(static, function(i,o){

						o(obj);

					});
					
					$("#visual-video-timeline").val(value).trigger("input");

				}
			});


		} else {


			obj.db = db;
			obj.time = value;

			if ($("div.module[module='visual/overlay']").attr("meta") == "POSE") {

				obj.meta = $("div.module[module='visual/overlay']").attr("meta");

				var points = [];



				$("#visual-video-canvas circle[overlay='"+db+"']").each(function(){

					var item = {};

					item.x = $(this).attr("cx").replace("%", "");
					item.y = $(this).attr("cy").replace("%", "");
					item.hide = $(this).attr("hide");


					points.push(item);


				});

				if (points.length > 0) {

					obj.preset = JSON.stringify(points);

				}

				
				$.ajax({
					url: "/modules/visual/overlay/add.php",
					type: "POST",
					data: obj,		
					success: function(data){

						$("#visual-video-canvas circle[overlay='"+db+"']").remove();

						$.each(static, function(i,o){

							o(obj);

						});
						
						$("#visual-video-timeline").val(value).trigger("input");

					}
				});




			} else {


				$.ajax({
					url: "/modules/visual/overlay/add.php",
					type: "POST",
					data: obj,		
					success: function(data){

						$("#visual-video-canvas circle[overlay='"+db+"']").remove();

						$.each(static, function(i,o){

							o(obj);

						});
						
						$("#visual-video-timeline").val(value).trigger("input");

					}
				});

			}







		}

	}


	// } else if ($("#visual-video-canvas rect[overlay='"+db+"']").length > 0 && $("#visual-video-canvas rect[overlay='"+db+"']").attr("x") == "0%" && $("#visual-video-canvas rect[overlay='"+db+"']").attr("x") == "0%") {









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





var visual_overlay_point_id = null;
var visual_overlay_point_active = false;
var visual_overlay_rect_id = null;
var visual_overlay_rect_active = false;

var timeoutId = 0;

$(document).on("mousedown", "#visual-video-canvas", function(e){

	if ($("#visual-video-canvas circle:hover").length == 1 && $("#visual-video-canvas circle:hover").attr("db") != undefined) {

		visual_overlay_point_active = true;
		visual_overlay_point_id = $("#visual-video-canvas circle:hover").attr("db");

	} else if ($("#visual-video-canvas rect:not(.ghost):hover").length == 1) {

	    timeoutId = setTimeout(function(){

			visual_overlay_rect_active = true;
			visual_overlay_rect_id = $("#visual-video-canvas rect:hover").attr("overlay");

	    }, 200);

	}


});


$(document).on("mousemove", "#visual-video-canvas", function(e){

	if (visual_overlay_point_active == true && visual_overlay_point_id != null){

		$("#visual-video-canvas circle[db='"+visual_overlay_point_id+"']").addClass("active");

		var y = (e.pageY - $("#visual-video-canvas").position().top) / $("#visual-video-canvas").outerHeight() * 100;
		var x = (e.pageX - $("#visual-video-canvas").position().left) / $("#visual-video-canvas").outerWidth() * 100;

		$("#visual-video-canvas circle[db='"+visual_overlay_point_id+"']").attr("cx", x+"%");
		$("#visual-video-canvas circle[db='"+visual_overlay_point_id+"']").attr("cy", y+"%");


		var overlay = $("#visual-video-canvas circle[db='"+visual_overlay_point_id+"']").attr("overlay");

		if ($("#visual-video-canvas rect[overlay='"+overlay+"']").length > 0) {

			var vertices = [];

			$("#visual-video-canvas circle[overlay='"+overlay+"']").each(function(){

				var item = {};
				item.x = parseFloat($(this).attr("cx").replace("%", ""));
				item.y = parseFloat($(this).attr("cy").replace("%", ""));

				vertices.push(item);

			});

			if (vertices.length == 2) {

				// //console.log(vertices);

				var rect = generateRect(vertices[0].x, vertices[1].x, vertices[0].y, vertices[1].y);


				// var x = null;
				// var y = null;
				// var w = null;
				// var h = null;


				// w = Math.abs(vertices[0].x - vertices[1].x);
				// h = Math.abs(vertices[0].y - vertices[1].y);


				// if (vertices[0].x <= vertices[1].x) {

				// 	if (vertices[0].y <= vertices[1].y) {

				// 		x = vertices[0].x;
				// 		y = vertices[0].y;

				// 	} else {

				// 		x = vertices[0].x;
				// 		y = vertices[0].y - h;

				// 	}

				// } else {


				// 	if (vertices[0].y <= vertices[1].y) {

				// 		x = vertices[1].x;
				// 		y = vertices[1].y - h;

				// 	} else {

				// 		x = vertices[1].x;
				// 		y = vertices[1].y;


				// 	}
				// }


				$("#visual-video-canvas rect[overlay='"+overlay+"']").attr("width", rect.w+"%");
				$("#visual-video-canvas rect[overlay='"+overlay+"']").attr("height", rect.h+"%");
				$("#visual-video-canvas rect[overlay='"+overlay+"']").attr("x", rect.x+"%");
				$("#visual-video-canvas rect[overlay='"+overlay+"']").attr("y", rect.y+"%");


			} else {


			}


		};


		if ($("#visual-video-canvas polygon[overlay='"+overlay+"']").length > 0) {

			var db = overlay;

			var points = [];

			var o = {};

			$("#visual-video-canvas circle[overlay='"+db+"']").removeClass("marked").removeClass("next");

			o.x = $("#visual-video-canvas").outerWidth() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"']:not(.marked):first").attr("cx").replace("%", "")) / 100;
			o.y = $("#visual-video-canvas").outerHeight() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"']:not(.marked):first").attr("cy").replace("%", "")) / 100;

			var text = o.x+" "+o.y;
			points.push(text);

			$("#visual-video-canvas circle[overlay='"+db+"']:not(.marked):first").addClass("next");


			function iterate(){

				var overlay = db;

				var target = $("#visual-video-canvas circle[overlay='"+overlay+"']").length;
				var count = $("#visual-video-canvas circle[overlay='"+overlay+"'].marked").length;

				if (count == target - 1) {

					// alert("Hooray");

					//console.log(points);

					var pointString = points.join(" ");

					// var path = visualBboxInsertMakeSvg('polygon', {overlay: db, points: pointString, stroke: "white", "stroke-width": 2, fill: color});

					// svg.appendChild(path);
					$("#visual-video-canvas polygon[overlay='"+overlay+"']").attr("points", pointString);

					return false;

				}

				var mark = $("#visual-video-canvas circle[overlay='"+overlay+"']:not(.marked).next");
				mark.addClass("marked").removeClass("next");

				var x0 = parseFloat(mark.attr("cx").replace("%", ""));
				var y0 = parseFloat(mark.attr("cy").replace("%", ""));


				var coordinates = {};
				var keys = [];

				$("#visual-video-canvas circle[overlay='"+overlay+"']:not(.marked)").each(function(){

					var id = $(this).attr("db");
					var x1 = parseFloat($(this).attr("cx").replace("%", ""));
					var y1 = parseFloat($(this).attr("cy").replace("%", ""));

					var xd = Math.abs(x0 - x1);
					var yd = Math.abs(y0 - y1);

					var zd = Math.sqrt(xd * xd + yd * yd);					

					coordinates[zd] = id;
					keys.push(zd);

				});


				keys.sort(function(a,b) { return a - b;});
				var index = keys[0];

				$("#visual-video-canvas circle[overlay='"+db+"'][db='"+coordinates[index]+"']:not(.marked)").addClass("next");

				var o = {};

				o.x = $("#visual-video-canvas").outerWidth() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"'][db='"+coordinates[index]+"']").attr("cx").replace("%", "")) / 100;
				o.y = $("#visual-video-canvas").outerHeight() * parseFloat($("#visual-video-canvas circle[overlay='"+db+"'][db='"+coordinates[index]+"']").attr("cy").replace("%", "")) / 100;

				var text = o.x+" "+o.y;
				points.push(text);

				iterate();

				setTimeout(function(){


				}, 0);



				// //console.log(queue);

				// $.each(queue, function(i,o){

				// 	// //console.log(o);
				// 	// //console.log(next);

				// 	if (o != undefined && i == next) {



				// 		now = i;
				// 		queue[i] = undefined;

				// 		// //console.log(i);
				// 		// //console.log(now);

				// 		return false;

				// 	}

				// });

				// //console.log(now);

				// now = null;

				// count++;
				// //console.log(count);

				// iterate();

			}


			iterate();




			// var vertices = [];

			// $("#visual-video-canvas circle[overlay='"+overlay+"']").each(function(){

			// 	var item = {};
			// 	item.x = $(this).attr("cx").replace("%", "");
			// 	item.y = $(this).attr("cy").replace("%", "");

			// 	vertices.push(item);

			// });

			// if (vertices.length == 2) {


			// } else {

			// 	var points = [];

			// 	$.each(vertices, function(i,o){

			// 		o.x = $("#visual-video-canvas").outerWidth() * o.x / 100;
			// 		o.y = $("#visual-video-canvas").outerHeight() * o.y / 100;

			// 		var text = o.x+" "+o.y;
			// 		points.push(text);

			// 	});


			// 	var pointString = points.join(" ");

			// 	$("#visual-video-canvas polygon[overlay='"+overlay+"']").attr("points", pointString);



			// }

		}

		if ($("#visual-video-canvas line[overlay='"+overlay+"']").length > 0) {


			var poseList = [
				[0, 1],
				[1, 8],
				[8, 9],
				[9, 10],
				[1, 11],
				[11, 12],
				[12, 13],
				[1, 2],
				[2, 3],
				[3, 4],		
				[1, 5],
				[5, 6],
				[6, 7],	
				[0, 15],
				[15, 17],
				[0, 14],
				[14, 16],				
			];

			$.each(poseList, function(i,o){

				var db = overlay;

				if ($("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"'][hide='0']").length > 0 && $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"'][hide='0']").length > 0) {

					var x1 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"']").attr("cx");
					var y1 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[0]+"']").attr("cy");
					var x2 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"']").attr("cx");
					var y2 = $("#visual-video-canvas circle[overlay='"+db+"'][index='"+o[1]+"']").attr("cy");

					//console.log(x1);
					//console.log(y1);

					var index = o[0]+"-"+o[1];

					$("#visual-video-canvas line[overlay='"+overlay+"'][index='"+index+"']").attr("x1", x1);
					$("#visual-video-canvas line[overlay='"+overlay+"'][index='"+index+"']").attr("x2", x2);
					$("#visual-video-canvas line[overlay='"+overlay+"'][index='"+index+"']").attr("y1", y1);
					$("#visual-video-canvas line[overlay='"+overlay+"'][index='"+index+"']").attr("y2", y2);

				}


			});

		}


	} else if (visual_overlay_rect_active == true && visual_overlay_rect_id != null) {

		$("#visual-video-canvas rect[overlay='"+visual_overlay_rect_id+"']").addClass("active");

		var width = parseFloat($("#visual-video-canvas rect[overlay='"+visual_overlay_rect_id+"']").attr("width").replace("%", ""));
		var height = parseFloat($("#visual-video-canvas rect[overlay='"+visual_overlay_rect_id+"']").attr("height").replace("%", ""));

		var y = (e.pageY - $("#visual-video-canvas").position().top) / $("#visual-video-canvas").outerHeight() * 100 - height / 2;
		var x = (e.pageX - $("#visual-video-canvas").position().left) / $("#visual-video-canvas").outerWidth() * 100 - width / 2;

		$("#visual-video-canvas rect[overlay='"+visual_overlay_rect_id+"']").attr("x", x+"%");
		$("#visual-video-canvas rect[overlay='"+visual_overlay_rect_id+"']").attr("y", y+"%");


		$("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:first").attr("cx", x+"%");
		$("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:first").attr("cy", y+"%");

		$("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:last").attr("cx", x+width+"%");
		$("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:last").attr("cy", y+height+"%");


	}






});



$(document).on("mouseup", "#visual-video-canvas", function(e){

	if (visual_overlay_point_active == true && visual_overlay_point_id != null){

		var x = $("#visual-video-canvas circle[db='"+visual_overlay_point_id+"']").attr("cx").replace("%", "");
		var y = $("#visual-video-canvas circle[db='"+visual_overlay_point_id+"']").attr("cy").replace("%", "");

		var overlay = $("#visual-video-canvas circle[db='"+visual_overlay_point_id+"']").attr("overlay");

		$.ajax({
			url: "/modules/visual/overlay/move.php",
			type: "POST",
			data: {
				db: visual_overlay_point_id,
				x: x,
				y: y
			},
			success: function(data){


				var db = $("div.visual-bbox-bar circle[db='"+overlay+"']").closest(".visual-bbox-bar").attr("data-db");


				$("div.visual-bbox-bar circle[db='"+overlay+"']").remove();

				var value = $("#visual-video-timeline").val();

				var obj = {};
				obj.db = db;
				obj.time = value;


				$.each(static, function(i,o){

					o(obj);

				});

			}

		});

	} else if (visual_overlay_rect_active == true && visual_overlay_rect_id != null) {

		var x0 = $("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:first").attr("cx").replace("%", "");
		var y0 = $("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:first").attr("cy").replace("%", "");
		var i0 = $("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:first").attr("db");

		var x1 = $("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:last").attr("cx").replace("%", "");
		var y1 = $("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:last").attr("cy").replace("%", "");
		var i1 = $("#visual-video-canvas circle[overlay='"+visual_overlay_rect_id+"']:last").attr("db");

		var overlay = visual_overlay_rect_id;

		$.ajax({
			url: "/modules/visual/overlay/move.php",
			type: "POST",
			data: {
				db: i0,
				x: x0,
				y: y0
			},
			success: function(data){


				$.ajax({
					url: "/modules/visual/overlay/move.php",
					type: "POST",
					data: {
						db: i1,
						x: x1,
						y: y1
					},
					success: function(data){

						var db = $("div.visual-bbox-bar circle[db='"+overlay+"']").closest(".visual-bbox-bar").attr("data-db");

						$("div.visual-bbox-bar circle[db='"+overlay+"']").remove();

						var value = $("#visual-video-timeline").val();

						var obj = {};
						obj.db = db;
						obj.time = value;


						$.each(static, function(i,o){

							o(obj);

						});

					}

				});


			}

		});


	}


	visual_overlay_point_active = false;
	visual_overlay_point_id = null;

	visual_overlay_rect_active = false;
	visual_overlay_rect_id = null;

    clearTimeout(timeoutId);

});


$(document).on("dblclick", "#visual-video-canvas rect:not(.ghost), #visual-video-canvas polygon", function(e){

	var obj = {};

	obj.db = $(this).attr("overlay");
	var overlay = obj.db;

	obj.y = (e.pageY - $("#visual-video-canvas").position().top) / $("#visual-video-canvas").outerHeight() * 100;
	obj.x = (e.pageX - $("#visual-video-canvas").position().left) / $("#visual-video-canvas").outerWidth() * 100;


	var actor = $("div.visual-bbox-bar circle[db='"+obj.db+"']").closest(".visual-bbox-bar").attr("data-db");
	var value = $("#visual-video-timeline").val();

	$.ajax({
		url: "/modules/visual/overlay/add_point.php",
		type: "POST",
		data: obj,		
		success: function(data){


			$("div.visual-bbox-bar circle[db='"+overlay+"']").remove();


			var obj = {};
			obj.db = actor;
			obj.time = value;

			$.each(static, function(i,o){

				o(obj);

			});
			

		}
	});


});

$(document).on("dblclick", "#visual-video-canvas rect.ghost", function(e){


	var overlay = $(this).attr("overlay");
	$("div.visual-bbox-bar[data-db='"+overlay+"']").find("button.visual-bbox-insert").click();

});



$(document).on("contextmenu", "#visual-video-canvas", function(e){

	e.preventDefault();

});

$(document).on("contextmenu", "#visual-video-canvas circle", function(e){

	e.preventDefault();

	if ($("div.module[module='visual/overlay']").attr("meta") == "POSE") {



		var obj = {};

		obj.db = $(this).attr("db");

		if ($(this).attr("hide") == 1) {

			obj.hide = 0;

		} else {

			obj.hide = 1;

		}


		$.ajax({
			url: "/modules/visual/overlay/disable_point.php",
			type: "POST",
			data: obj,		
			success: function(data){

				$("div.visual-bbox-bar circle[db='"+obj.db+"']").remove();

				$.each(static, function(i,o){

					o();

				});
				

			}
		});

		return false;

	} else {


		var obj = {};

		obj.db = $(this).attr("db");
		var overlay = $(this).attr("overlay");

		if ($("#visual-video-canvas circle[overlay='"+overlay+"']").length <= 2) {

			alert("You must have at least two points.");
			return false;

		}


		$.ajax({
			url: "/modules/visual/overlay/remove_point.php",
			type: "POST",
			data: obj,		
			success: function(data){

				$("div.visual-bbox-bar circle[db='"+obj.db+"']").remove();

				$.each(static, function(i,o){

					o();

				});
				

			}
		});


	}


});

function generateRect(x0, x1, y0, y1){

	x0 = parseFloat(x0);
	x1 = parseFloat(x1);
	y0 = parseFloat(y0);
	y1 = parseFloat(y1);

	var x = null;
	var y = null;
	var w = null;
	var h = null;


	w = Math.abs(x0 - x1);
	h = Math.abs(y0 - y1);

	if (x0 <= x1) {

		if (y0 <= y1) {

			x = x0;
			y = y0;

		} else {

			x = x0;
			y = y0 - h;

		}

	} else {


		if (y0 <= y1) {

			x = x1;
			y = y1 - h;

		} else {

			x = x1;
			y = y1;


		}
	}


	var obj = {};
	obj.x = parseFloat(x);
	obj.y = parseFloat(y);
	obj.w = parseFloat(w);
	obj.h = parseFloat(h);

	return obj;
}


var shiftKey = false;


$(document).on("keydown", function(e){

	if (e.which == 16) {

		shiftKey = true;

	}


});

$(document).on("keyup", function(e){



	if ($("input[type='text']:focus, input[type='range']:focus").length > 0) {

		$("input[type='text']:focus, input[type='range']:focus").blur();

	}

	//console.log(e.which);



	if (e.which == 80) {

		var pane = document.getElementById("visual-video-pane");

		if (pane.paused == true) {

			pane.play();

		} else {

			pane.pause();

			window.history.replaceState({}, null, "#"+$("#visual-video-timeline").val());

		}

	} else if (e.which == 37) {

		var pane = document.getElementById("visual-video-pane");

		pane.pause();

		var value = parseFloat($("#visual-video-timeline").val());

		value -= 1;

		$("#visual-video-timeline").val(value).trigger("input");

	} else if (e.which == 39) {

		var pane = document.getElementById("visual-video-pane");

		pane.pause();

		var value = parseFloat($("#visual-video-timeline").val());

		value += 1;

		$("#visual-video-timeline").val(value).trigger("input");


	} else if (e.which == 74) {

		var value = parseInt($("#visual-video-timeline").val());

		var db = $(this).attr("data-db");
		var times = [];

		$("#visual-video-dots").find("circle").each(function(i,o){

			var item = parseInt($(this).attr("time"));

			if (item < value) {

				times.push(item);

			}


		});

		times.sort(function(a, b){return a-b});

		var prev = 0;
		var target = times[times.length - 1];


		$("#visual-video-dots circle[time='"+target+"']").click();


	} else if (e.which == 75) {


		var value = parseInt($("#visual-video-timeline").val());

		var db = $(this).attr("data-db");
		var times = [];

		$("#visual-video-dots").find("circle").each(function(i,o){

			var item = parseInt($(this).attr("time"));

			if (item > value) {

				times.push(item);

			}


		});

		times.sort(function(a, b){return a-b});

		var prev = 0;
		var target = times[0];

		$("#visual-video-dots circle[time='"+target+"']").click();

	} else if (e.which >= 49 && e.which <= 57) {

		var index = e.which - 49;

		$("#visual-bbox-timeline div.visual-bbox-bar:eq("+index+")").find("button.visual-bbox-insert").click();


	} else if (e.which == 16) {

		shiftKey = false;

	} else if (e.which == 188) {

		$("button.visual-bbox-start").click();

	} else if (e.which == 190) {

		$("button.visual-bbox-end").click();

	} else {


		// var number = e.which - 49;
		// $("div.visual-bbox-bar:eq("+number+")").find("button.visual-bbox-insert").click();


	}


});




$(document).on("click", "button.visual-bbox-start", function(){

	var element = $(this).closest("div.visual-bbox-bar");
	var value = $("#visual-video-timeline").val();

	element.find("input.visual-bbox-start-text").val(value);

});



$(document).on("click", "button.visual-bbox-end", function(){

	var element = $(this).closest("div.visual-bbox-bar");
	var value = $("#visual-video-timeline").val();

	element.find("input.visual-bbox-end-text").val(value);

});


$(document).on("click", "button.visual-bbox-range-create", function(){

	var element = $(this).closest("div.visual-bbox-bar");
	var db = element.attr("data-db");

	var start = parseInt(element.find("input.visual-bbox-start-text").val());
	var end = parseInt(element.find("input.visual-bbox-end-text").val());

	element.find("circle").sort(function(a,b){

	      var contentA =parseInt( $(a).attr('time'));
	      var contentB =parseInt( $(b).attr('time'));
	      return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;

	}).appendTo(element.find("svg")); // append again to the list



	if (element.find("circle[time='"+start+"']").next("circle[time='"+end+"']").length == 1) {


		// var response = confirm("Would you like to commit this range? (You may experience a brief delay)");

		var response = true;
		
		var startObj = element.find("circle[time='"+start+"']");
		var startPoints = JSON.parse(startObj.attr("points"));
		
		var endObj = element.find("circle[time='"+end+"']");
		var endPoints = JSON.parse(endObj.attr("points"));


		if (response == true && startPoints.length > 0 && endPoints.length > 0) {

			var obj = {};

			obj.db = db;
			obj.start = start;
			obj.end = end;
			obj.startX0 = parseFloat(startPoints[0].position[0]);
			obj.startY0 = parseFloat(startPoints[0].position[1]);
			obj.startX1 = parseFloat(startPoints[1].position[0]);
			obj.startY1 = parseFloat(startPoints[1].position[1]);
			obj.endX0 = parseFloat(endPoints[0].position[0]);
			obj.endY0 = parseFloat(endPoints[0].position[1]);
			obj.endX1 = parseFloat(endPoints[1].position[0]);
			obj.endY1 = parseFloat(endPoints[1].position[1]);

			// //console.log(obj);


			$.ajax({
				url: "/modules/visual/overlay/tween.php",
				type: "POST",
				data: obj,		
				success: function(data){

					// window.location.reload();
					// alert("Hello");

					$.each(static, function(i,o){

						o(obj);

					});
					

				}
			});

		} else {


		}

			// circle.remove();
			// // $("#visual-video-dots *").remove();

			// $("#visual-video-dots circle[time='"+time+"']").remove();


			// $.each(animate, function(k,q){

			// 	q();

			// });






	} else {

		// alert("No");
		alert("Please ensure that there are no points in between.");

	}

});




$(document).on("click", "button.visual-bbox-range-remove", function(){


	var element = $(this).closest("div.visual-bbox-bar");

	var start = parseInt(element.find("input.visual-bbox-start-text").val());
	var end = parseInt(element.find("input.visual-bbox-end-text").val());

	// var response = confirm("Would you like to remove this range?");
	var response = true;

	if (response == true) {



		var db = element.find("line[start='"+start+"'][end='"+end+"']").attr("db");
		element.find("line[start='"+start+"'][end='"+end+"']").remove();

		var obj = {};
		obj.db = db;

		$.ajax({
			url: "/modules/visual/overlay/remove_range.php",
			type: "POST",
			data: obj,		
			success: function(data){

				$.each(animate, function(k,q){

					q();

				});

				$.each(static, function(i,o){

					o();

				});
				

			}
		});

						

		// for (var i = start; i <= end; i++) {

		// 	if (element.find("circle[time='"+i+"']").length > 0) {

		// 		var circle = element.find("circle[time='"+i+"']");

		// 		var obj = {};
		// 		obj.db = circle.attr("db");

		// 		circle.remove();
		// 		$("#visual-video-dots circle[time='"+i+"']").remove();

		// 		$.ajax({
		// 			url: "/modules/visual/overlay/remove.php",
		// 			type: "POST",
		// 			data: obj,		
		// 			success: function(data){

		// 				$.each(animate, function(k,q){

		// 					q();

		// 				});

		// 				// $.each(static, function(i,o){

		// 				// 	o();

		// 				// });
						

		// 			}
		// 		});



		// 	}


		// }

	}

});


$(document).on("click", "button.visual-bbox-insert-action", function(){


	var element = $(this).closest("div.visual-bbox-bar");
	var db = element.attr("data-db");

	var start = parseInt(element.find("input.visual-bbox-start-text").val());
	var end = parseInt(element.find("input.visual-bbox-end-text").val());


	if (isNaN(start) == true || isNaN(end) == true) {

		alert("Make sure to mark both frames.")
		return false;

	}

	if ($("#cwc_graph_svg_conceptual circle[type='ACTION'].active").length > 0) {

		var obj = {};

		obj.db = db;
		obj.event = $("#cwc_graph_svg_conceptual circle[type='ACTION'].active").attr("index");
		obj.start = start;
		obj.end = end;
		obj.session = session_id

		$.ajax({
			url: "/modules/visual/overlay/update_event.php",
			type: "POST",
			data: obj,		
			success: function(data){
				
				$("html,body").animate({scrollTop: $("div[module='db/graph']").offset().top})

			}
		});		


	} else {


		var response = prompt("Enter the name of this event");

		if (response != null && response != "") {

			var obj = {};

			obj.db = db;
			obj.start = start;
			obj.name = response;
			obj.end = end;
			obj.session = session_id

			$.ajax({
				url: "/modules/visual/overlay/add_event.php",
				type: "POST",
				data: obj,		
				success: function(data){

					if ($("div[module='db/graph']").length > 0) {

						$("html,body").animate({scrollTop: $("div[module='db/graph']").offset().top})

					}
					

				}
			});		


		}

	}




});



$(document).on("click", "button.visual-bbox-reset", function(){

	var element = $(this);
	var db = element.closest(".visual-bbox-bar").attr("data-db");

	if (element.closest(".visual-bbox-bar").find("circle.active").length > 0) {

		var overlay = element.closest(".visual-bbox-bar").find("circle.active").attr("db");
		var points = element.closest(".visual-bbox-bar").find("circle.active").attr("points");
		var circle = element.closest(".visual-bbox-bar").find("circle.active");
		var value = $("#visual-video-timeline").val();

		$.ajax({
			url: "/modules/visual/overlay/reset_pose.php",
			type: "POST",
			data: {
				db: overlay,
				points: JSON.parse(points),
			},
			success: function(data){

				$("div.visual-bbox-bar circle[db='"+overlay+"']").remove();

				var obj = {};
				obj.db = db;
				obj.time = value;


				$.each(static, function(i,o){

					o(obj);

				});

			}

		})

	}


});


$(document).on("click", ".visual-bbox-import", function(e){


	var button = $(this);
	var scene = parseInt(code.replace("LAYOUT","").replace("GRAPH",""));


	function pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}	

	var scene = pad(scene, 3);


	var name = $(this).closest("div.visual-bbox-bar").attr("data-name");
	var db = $(this).closest("div.visual-bbox-bar").attr("data-db");
	var value = $("#visual-video-timeline").val();
	var meta = $("div[module='visual/overlay']").attr("meta");

	if ($(this).closest("div.visual-bbox-bar").find("svg circle.active").length > 0) {

		alert("Cannot overwrite existing keyframe.");
		return false;

	}

	// alert("Importing "+meta+" from #"+scene+" into "+session_id+" for "+name+" ("+db+") in frame #"+value);


	button.prop("disabled", true);

	$.ajax({
		url: "/modules/db/asset/import_json.php",
		data: {
			scene: scene,
			session: session_id,
			mode: "visual",
			meta: meta,
			frame: value,
			name: name,
			db: db
		},
		type: "POST",
		success: function(data){

			button.prop("disabled", false);

			if (data.trim() == "FAIL") {

				alert("No annotation detected.");

			}

			$.each(static, function(i,o){

				o();

			});

			$("#visual-video-timeline").val(value).trigger("input");

		}
	})




});