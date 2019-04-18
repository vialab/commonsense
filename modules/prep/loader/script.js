callback.prepLoader = function(){

	

	$.ajax({
	  url: "https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js",
	  dataType: "script",
	  success: prepLoaderStart
	});


}


function prepLoaderStart(){

	var rootPath = "http://wednesday.csail.mit.edu/jwulff/scenes_sri/";
	
	// var rootPath = "http://commonsense.ckprototype.com/temp/loader/";
	$.ajax({
		url: "/modules/prep/loader/browse.php",
		type: "GET",
		data:{
			root: rootPath
		},
		success: function(data){

			var html = $.trim(data);

			$(html).find("a[href*='.mp4']").each(function(){

				var video = $(this).attr("href");
				var stripped = video.replace(".mp4", "");
				var bbox = stripped+".json";
				var estimate = stripped+".json";

				$("#prep_loader_table").append('<tr><td class="video" path="'+rootPath+'video_clips/'+video+'"><small class="d-block" style="word-break:break-all">'+video+'</small></td><td class="bbox"><small class="d-block" style="word-break:break-all">'+bbox+'</small></td><td class="estimate"><small class="d-block" style="word-break:break-all">'+estimate+'</small></td><td class="metadata"><small class="d-block" style="word-break:break-all">'+estimate+'</small></td><td class="text-center align-middle"><h6 class="text-uppercase small mb-1">Dimensions</h6><input class="form-control-sm form-control w-50 d-inline-block width" value="1920" type="number"><input class="form-control-sm form-control w-50 d-inline-block height" value="816" type="number"><h6 class="text-uppercase small mb-1 mt-1">Frames</h6><input class="form-control-sm form-control w-50 d-inline-block frames" value="0" type="number"><br><button disabled class="mt-2 btn btn-sm btn-primary generate_layout">Import</button> <button disabled class="mt-2 btn btn-sm btn-primary generate_layout2">Start New</button></td><td><div class="input-group input-group-sm"><select class="form-control form-control-sm"><option value="">Select one</option><option value="" disabled>---</option></select>  <div class="input-group-append"><button class="btn btn-primary prep_continue" type="button"><i class="fa fa-arrow-right"></i></button><button class="btn btn-success prep_download" type="button"><i class="fa fa-download"></i></button></div></div></td></tr>');

			});

			$("#prep_loader_table tr").each(function(){

				var row = $(this);
				var video = row.find("td.video").attr("path");

				$.ajax({
					url: "/modules/prep/loader/sessions.php",
					type: "POST",
					data: {
						video: video
					},
					success: function(data){

						var array = JSON.parse(data);

						$.each(array, function(i, o){

							row.find("select").append("<option value='"+o.CODE+"_"+o.SESSION+"'>"+o.SESSION+" ("+o.CREATED_DATE+")</option>");

						})

						row.find("select option:first").text(array.length + " session(s)");


					}
				});



				$(this).find(".video").prepend(" <i class='fa fa-check-circle text-success'></i>");

				var bbox = $(this).find(".bbox");
				var bboxPath = rootPath+"bounding_boxes/"+bbox.text();

				bbox.attr("path", bboxPath);

				$.ajax({
					url: "/modules/prep/loader/resolve.php?url="+bboxPath,
					type: "GET",
					success: function(data){



						if (data == "") {

							bbox.prepend(" <i class='fa fa-times-circle text-danger'></i>");

						} else {


							var keys = Object.keys(JSON.parse(data));
							var length = keys.length;

							bbox.prepend(" <i class='fa fa-check-circle text-success'></i>");


							row.find("input.frames").val(length).addClass("alert-success");

						}

						prepLoaderCheck();

					}

				});

				var estimate = $(this).find(".estimate");
				var estimatePath = rootPath+"3D_reconstructions_estimated/"+estimate.text();

				estimate.attr("path", estimatePath);

				$.ajax({
					url: "/modules/prep/loader/resolve.php?url="+estimatePath,
					type: "GET",
					success: function(data){

						if (data == "") {

							estimate.prepend(" <i class='fa fa-times-circle text-danger'></i>");

						} else {

							estimate.prepend(" <i class='fa fa-check-circle text-success'></i>");

						}

						prepLoaderCheck();

					}

				});



				var metadata = $(this).find(".metadata");
				var metadataPath = rootPath+"metadata/"+metadata.text();

				metadata.attr("path", metadataPath);

				$.ajax({
					url: "/modules/prep/loader/resolve.php?url="+metadataPath,
					type: "GET",
					success: function(data){



						if (data == "") {

							metadata.prepend(" <i class='fa fa-times-circle text-danger'></i>");

						} else {


							var data = JSON.parse(data);

							metadata.prepend(" <i class='fa fa-check-circle text-success'></i>");

							console.log(data);

							row.find("input.frames").val(data.n_frames).addClass("alert-success");
							row.find("input.width").val(data.width).addClass("alert-success");
							row.find("input.height").val(data.height).addClass("alert-success");

						}

						prepLoaderCheck();

					}

				});

			});



		}

	});	


}

function prepLoaderCheck(){

	$("#prep_loader_table tr").each(function(){

		var success = 0;
		var row = $(this);

		$(this).find("td").each(function(){

			var cell = $(this);

			if (cell.find(".text-success").length > 0) {

				cell.find("small").wrap("<a href='"+cell.attr("path")+"' target='_blank'>");
				success++;
			}
			

		});

		if (success == 1) {

			row.find("button").prop("disabled", false);

		} else {

			// row.find("button").prop("disabled", false);

		}


	});


}




$(document).on("click", ".generate_layout2", function(){

	var row = $(this).closest("tr");

	var bbox = "";
	var estimate = "";
	var video = row.find("td.video a").attr("href");

	var width = row.find(".width").val();
	var height = row.find(".height").val();
	var frames = row.find(".frames").val();

	// var videomd5 = md5(videomd5); 

	$.ajax({
		url: "/modules/prep/loader/generate.php",
		type: "POST",
		data:{
			length: length,
			file: video,
			bbox: bbox,
			estimate: estimate,
			width: width,
			height: height,
			frames: frames,
		},
		success: function(data){


			var href = "http://commonsense.ckprototype.com/view/?code="+data+"&session="+data+"&stoppoll";
			window.open(href);
		
		}

	});			



});

$(document).on("click", ".generate_layout", function(){

	var row = $(this).closest("tr");

	var bbox = row.find("td.bbox a").attr("href");
	var estimate = row.find("td.estimate a").attr("href");
	var video = row.find("td.video a").attr("href");

	var width = row.find(".width").val();
	var height = row.find(".height").val();
	var frames = row.find(".frames").val();

	// var videomd5 = md5(videomd5); 

	$.ajax({
		url: "/modules/prep/loader/generate.php",
		type: "POST",
		data:{
			length: length,
			file: video,
			bbox: bbox,
			estimate: estimate,
			width: width,
			height: height,
			frames: frames,
		},
		success: function(data){


			var href = "http://commonsense.ckprototype.com/view/?code="+data+"&session="+data+"&stoppoll";
			window.open(href);
		
		}

	});			



});


$(document).on("click", ".prep_continue", function(){

	var value = $(this).closest(".input-group").find("select").val();

	if (value != "") {

		var href = "/view/?code="+value+"&session="+value;
		window.open(href);

	}

});


$(document).on("click", ".prep_download", function(){

	var value = $(this).closest(".input-group").find("select").val();

	if (value != "") {

		var href = "/modules/prep/saver/save.php?mode=3d&session="+value+"&code="+value;
		window.open(href);

		var href = "/modules/prep/saver/save.php?mode=bbox&session="+value+"&code="+value;
		window.open(href);

	}

});