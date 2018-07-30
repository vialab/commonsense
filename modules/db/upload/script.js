callback.cwcUpload = function(){



}


$(document).on("change", "#cwc_upload_file", function(){


	var input = $(this)[0];
	var element = $(this);

	var reader = new FileReader();
	element.prop("disabled", true);


	reader.onload = function (e)
	{   


		element.val("");
		$("#cwc_upload_log").prepend("Processing...\n");

		var contentArray = e.target.result.split(";base64,");
		var contentType = contentArray[0];
		var contentBody = contentArray[1];

		if (contentType.indexOf("json") == -1) {

			alert("Invalid file. Please try again.");
			element.prop("disabled", false);
			return false;

		}

		var body = window.atob(contentBody);
		var json = JSON.parse(body);

		console.log(json);

		var nodes = {};

		var xArray = [];
		var yArray = [];


		$.each(json.nodes, function(i,o){

			xArray.push(o.pos[0]);
			yArray.push(o.pos[1]);

		});

		var xMax = Math.max.apply(null, xArray);
		var yMax = Math.max.apply(null, yArray);

		$.each(json.nodes, function(i,o){

			if (nodes[o.type] == undefined) {

				nodes[o.type] = {};

			}


			if (o.subtype == undefined) {

				o.subtype = "default";

			}

			o.x = o.pos[0] / xMax * 100;
			o.y = o.pos[1] / yMax * 100;

			if (nodes[o.type][o.subtype] == undefined) {

				nodes[o.type][o.subtype] = {};

			}



			nodes[o.type][o.subtype][o.node_id] = o;


		});

		element.prop("disabled", false);


	    var obj = {};
		obj.nodes = JSON.stringify(nodes);
		obj.edges = JSON.stringify(json.edges);
		obj.session = session_id;

		var chunk = 2000000;
		var body = JSON.stringify(obj);

		var length = Math.ceil(body.length / chunk);

		var count = 0;

		$.ajax({
			url: "/generate/process/generate_code.php",
			success: function(data){

				var code = $.trim(data);
				var file = code+".json";
				var type = "text/json";

				for (var i = 0; i < length; i++) {

					var data = body.substr(i * chunk, chunk);

				    var obj = {};
					obj.data = data;
					obj.length = data.length;
					obj.max = length;
					obj.index = i;
					obj.code = code;
					obj.file = file;
					// obj.upload = true;



					$.ajax({
						url: "/generate/process/upload.php",
						data: obj,
						type: "POST",
						success: function(data){

							count++;

							$("#cwc_upload_log").prepend("Uploaded: ("+count+"/"+length+")\n");


							if (count == length) {
										

							    var obj = {};
								obj.code = code;
								obj.name = file;
								obj.type = type;

								$.ajax({
									url: "/generate/process/combine.php",
									data: obj,
									type: "POST",
									success: function(data){

										$("#cwc_upload_log").prepend("Upload complete: "+code+"\n");

										var obj = {};
										obj.code = code;
										obj.session = session_id;

										$.ajax({
											url: "/modules/cwc/upload/upload.php",
											data: obj,
											type: "POST",
											success: function(data){

												var data = JSON.parse(data);


												$.each(data.nodes, function(i,o){

													$("#cwc_upload_log").prepend(Object.keys(o).length+" '"+i+"' nodes(s) added\n");

												});



												$.each(data.attributes, function(i,o){

													$("#cwc_upload_log").prepend(Object.keys(o).length+" '"+i+"' attributes(s) added\n");

												});


												$("#cwc_upload_log").prepend(Object.keys(data.edges).length+" edge(s) added\n");

												$("#cwc_upload_log").prepend("---\n");

												element.prop("disabled", false);

											}
										});	


										// element.prev("button").prop("disabled", false);

										// moduleElem.find("input.module-meta").val(code).prop("disabled", false);
										// moduleElem.find("button.module-file").prop("disabled", false);

										// element.val("");



									}

								});

							}

						}
					});	

				}

			}
		});	



		// $.ajax({
		// 	url: "/modules/cwc/upload/upload.php",
		// 	data: obj,
		// 	type: "POST",
		// 	success: function(data){


		// 		$.each(data.nodes, function(i,o){

		// 			$("#cwc_upload_log").prepend(Object.keys(o).length+" '"+i+"' nodes(s) added\n");

		// 		});

		// 		console.log(data);


		// 		$.each(data.attributes, function(i,o){

		// 			$("#cwc_upload_log").prepend(Object.keys(o).length+" '"+i+"' attributes(s) added\n");

		// 		});


		// 		$("#cwc_upload_log").prepend(Object.keys(data.edges).length+" edge(s) added\n");

		// 		$("#cwc_upload_log").prepend("---\n");

		// 		element.prop("disabled", false);

		// 	},
		// 	error: function(){

		// 		alert("Error occurred.");

		// 		element.prop("disabled", false);

		// 	}
		// });	


	};


	reader.readAsDataURL(input.files[0]);


});