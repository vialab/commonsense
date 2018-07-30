var hash = "";


var moduleList = null;




$(document).on("click", "a.load_preset", function(e){


	e.preventDefault();

	var file = $(this).attr("file");

	window.location.hash = file;
	window.location.reload();


});



$(document).on("input", "input.column-width", function(){

	var value = $(this).val();
	var max = parseInt($(this).attr("max"));
	var min = parseInt($(this).attr("min"));


	if (value == "" || value == 1 || value < min) {

		value = 2;

	}

	if (value > max) {

		value = max;

	}

	$(this).val(value);


	var column = $(this).closest("div.column");

	column.removeAttr("class").addClass("column");
	column.addClass("col-"+value);

	generateJson();

});


$(document).on("click", "button.column-remove", function(){

	var column = $(this).closest("div.column");
	column.remove();

	generateJson();

});


$(document).on("click", "button.column-move-left", function(){

	var column = $(this).closest("div.column");
	var left = column.prev("div.column");

	left.before(column);

	generateJson();

});



$(document).on("click", "button.column-move-right", function(){

	var column = $(this).closest("div.column");
	var right = column.next("div.column");

	right.after(column);

	generateJson();

});

$(document).on("input", "#title, #author", function(){

	generateJson();


})



$(document).on("click", "button.module-add", function(){


	var menu = $(this).next("div.dropdown-menu");

	menu.empty();

	$.each(moduleList, function(heading,list){

		menu.append('<div class="dropdown-divider"></div>');

		menu.append('<h6 class="dropdown-header">'+heading+'</h6>');

		$.each(list, function(i,o){

			menu.append('<a class="dropdown-item module-add-item" href="#">'+heading+"/"+i+'</a>');

		});


	});



	
	menu.find('div.dropdown-divider:first').remove();

});



$(document).on("click", "a.module-add-item", function(e){

	e.preventDefault();

	var module = $(this).text();
	var column = $(this).closest("div.column");
	var page = $(this).closest("div.page");



	if (page.find(".module[module='"+module+"']").length == 0) {


		column.find("div.module-list .alert").hide();

		$.ajax({
			url: "./module/module.html",
			success: function(data){

				var dom = $(data);

				dom.find("h6 strong").text(module);
				dom.attr("module", module);

				var moduleArray = module.split("/");

				if (moduleList[moduleArray[0]][moduleArray[1]].meta != true) {

					dom.find("div.module-meta-box").find("input").prop("disabled", true).attr("placeholder", "No Asset Allowed");
					dom.find("div.module-meta-box").find("button.module-file").prop("disabled", true).hide();
					dom.find("div.module-meta-box").find("button.module-download").prop("disabled", true).hide();
													
				}

				if (moduleList[moduleArray[0]][moduleArray[1]].markdown != true) {

					dom.find("div.module-meta-box").find("button.module-markdown").prop("disabled", true).hide();

				}

				column.find("div.module-list").append(dom);


			$( ".module-list" ).sortable({
		      connectWith: ".module-list",
            	placeholder: "ui-state-highlight",
		      update: function(){

					generateJson();

		      }
		    }).disableSelection();	

				generateJson();



			}
		})


	} else {

		alert("This module is already in use.");

	}


});



$(document).on("click", "button.module-remove", function(){

	var module = $(this).closest("div.module");
	module.remove();

	generateJson();

});




$(document).on("input", "input.module-meta", function(){

	generateJson();

});

function generateJson(){

	var output = {};

	output.title = $("#title").val();
	output.author = $("#author").val();

	output.layout = [];

	$("div.page").each(function(){

		var elem = $(this);

		var page = {};

		page.title = $(this).find("input.page-title").val();
		page.columns = [];


		elem.find("div.column").each(function(){

			var elem2 = $(this);

			var column = {};

			var size = parseInt($(this).attr("class").replace("column", "").replace("col-", ""));
			column.size = size;

			column.modules = [];


			elem2.find("div.module").each(function(){

				var module = {};

				module.name = $(this).attr("module");
				module.meta = $(this).find("input").val();

				column.modules.push(module);


			});

			page.columns.push(column);

		});


		output.layout.push(page);


	});


	var json = JSON.stringify(output, null, "\t");

	$("#output").val(json);

    var obj = {};
	obj.data = json;
	obj.file = code;

	$.ajax({
		url: "./process/save.php",
		data: obj,
		type: "POST",
		success: function(data){
		
			$("#output").val(json);

		}
	});	



}




$(document).on("click", "#save_json", function(){

	var saveData = (function () {
	    var a = document.createElement("a");
	    document.body.appendChild(a);
	    a.style = "display: none";
	    return function (data, fileName) {
	        var json = data,
	            blob = new Blob([json], {type: "octet/stream"}),
	            url = window.URL.createObjectURL(blob);
	        a.href = url;
	        a.download = fileName;
	        a.click();
	        window.URL.revokeObjectURL(url);
	    };
	}());

	var data = $("#output").val(),
	    fileName = "spec.json";

	saveData(data, fileName);

});

$(document).on("click", "button.module-file", function(){

	var element = $(this);

	$(this).next("input[type='file']").click();

});

$(document).on("change", "input.module-file-input", function(){


	var input = $(this)[0];
	var element = $(this);

	var reader = new FileReader();


	var moduleElem = element.closest("div.module");
	moduleElem.find("input.module-meta").val("Uploading...").prop("disabled", true);
	moduleElem.find("button.module-file").prop("disabled", true);


	reader.onload = function (e)
	{   

		var chunk = 2000000;
		var body = e.target.result;

		var length = Math.ceil(body.length / chunk);
		var file = input.files[0].name;
		var type = input.files[0].type;



		var count = 0;




		$.ajax({
			url: "./process/generate_code.php",
			success: function(data){

				var code = $.trim(data);

				for (var i = 0; i < length; i++) {

					var data = body.substr(i * chunk, chunk);

				    var obj = {};
					obj.data = data;
					obj.length = data.length;
					obj.max = length;
					obj.index = i;
					obj.code = code;
					obj.file = file;
					obj.upload = true;

					console.log(obj);

					$.ajax({
						url: "./process/upload.php",
						data: obj,
						type: "POST",
						success: function(data){

							count++;

							var moduleElem = element.closest("div.module");
							moduleElem.find("input.module-meta").val("Uploading... ("+count+"/"+length+")").prop("disabled", true);

							if (count == length) {
										

							    var obj = {};
								obj.code = code;
								obj.name = file;
								obj.type = type;

								$.ajax({
									url: "./process/combine.php",
									data: obj,
									type: "POST",
									success: function(data){


										element.prev("button").prop("disabled", false);

										moduleElem.find("input.module-meta").val(code).prop("disabled", false);
										moduleElem.find("button.module-file").prop("disabled", false);

										element.val("");

										generateJson();

									}

								});

							}

						}
					});	

				}

			}
		});	


		return false;



	};



	reader.readAsDataURL(input.files[0]);

	// console.log(input.files[0]);

	// reader.readAsArrayBuffer(input.files[0]);

	// var arrayBuffer;

	// reader.onload = function(event) {
	
	//     arrayBuffer = event.target.result;
	// 	var bytes = new Uint8Array( arrayBuffer );

	// 	// console.log(bytes);


	// 	$.ajax({
	// 		url: "./process/generate_code.php",
	// 		success: function(data){

	// 			var code = $.trim(data);

	// 			var obj = {};
	// 			obj.code = code;
	// 			obj.bytes = bytes;

	// 			$.ajax({
	// 				url: "./process/upload.php",
	// 				data: obj,
	// 				type: "POST",
	// 				success: function(data){

	// 					alert(data);

	// 				}

	// 			});

	// 		}

	// 	});


	// 	// 		for (var i = 0; i < size; i++) {

	// 	// 		    var binary = [];

	// 	// 		    var start = i * chunk;
	// 	// 		    var end = i * chunk + chunk;

	// 	// 		    // binary = String.fromCharCode(...array);

	// 	// 		    /*

	// 	// 		    for (var j = start; j < end; j++) {
	// 	// 		        binary += String.fromCharCode( bytes[ j ] );
	// 	// 		    }			


	// 	// 			*/


	// 	// 		    for (var j = start; j < end; j++) {

	// 	// 		    	if (bytes[ j ] == undefined) {


	// 	// 		    	} else {

	// 	// 			        binary.push(bytes[ j ]);

	// 	// 		    	}

	// 	// 		    }								

	// 	// 		    var obj = {};
	// 	// 			obj.data = binary;
	// 	// 			obj.length = binary.length;
	// 	// 			obj.max = size;
	// 	// 			obj.index = i;
	// 	// 			obj.code = code;
	// 	// 			obj.file = file;

	// 	// 			console.log(obj);

	// 	// 			$.ajax({
	// 	// 				url: "./process/upload.php",
	// 	// 				data: obj,
	// 	// 				type: "POST",
	// 	// 				success: function(data){

	// 	// 					console.log(data);

	// 	// 					count++;

	// 	// 					var moduleElem = element.closest("div.module");
	// 	// 					moduleElem.find("input.module-meta").val("Uploading... ("+count+"/"+size+")").prop("disabled", true);

	// 	// 					if (count == size) {
										
	// 	// 						element.prev("button").prop("disabled", false);

	// 	// 						moduleElem.find("input.module-meta").val(code).prop("disabled", false);
	// 	// 						moduleElem.find("button.module-file").prop("disabled", false);

	// 	// 						element.val("");


	// 	// 					 //    var obj = {};
	// 	// 						// obj.code = code;

	// 	// 						// $.ajax({
	// 	// 						// 	url: "./process/combine.php",
	// 	// 						// 	data: obj,
	// 	// 						// 	type: "POST",
	// 	// 						// 	success: function(data){


	// 	// 						// 	}

	// 	// 						// });

	// 	// 					}

	// 	// 				}
	// 	// 			});	



	// 	// 		}



	// };
	    

	//  //    var chunk = 1024 * 1024 * 1;
	// 	// var size = Math.ceil(arrayBuffer.byteLength / chunk);

	//  //    var bytes = new Uint8Array( arrayBuffer );

	// 	// var file = input.files[0].name;

	// 	// var count = 0;

	// 	// $.ajax({
	// 	// 	url: "./process/generate_code.php",
	// 	// 	success: function(data){

	// 	// 		var code = $.trim(data);

	// 	// 		for (var i = 0; i < size; i++) {

	// 	// 		    var binary = [];

	// 	// 		    var start = i * chunk;
	// 	// 		    var end = i * chunk + chunk;

	// 	// 		    // binary = String.fromCharCode(...array);

	// 	// 		    /*

	// 	// 		    for (var j = start; j < end; j++) {
	// 	// 		        binary += String.fromCharCode( bytes[ j ] );
	// 	// 		    }			


	// 	// 			*/


	// 	// 		    for (var j = start; j < end; j++) {

	// 	// 		    	if (bytes[ j ] == undefined) {


	// 	// 		    	} else {

	// 	// 			        binary.push(bytes[ j ]);

	// 	// 		    	}

	// 	// 		    }								

	// 	// 		    var obj = {};
	// 	// 			obj.data = binary;
	// 	// 			obj.length = binary.length;
	// 	// 			obj.max = size;
	// 	// 			obj.index = i;
	// 	// 			obj.code = code;
	// 	// 			obj.file = file;

	// 	// 			console.log(obj);

	// 	// 			$.ajax({
	// 	// 				url: "./process/upload.php",
	// 	// 				data: obj,
	// 	// 				type: "POST",
	// 	// 				success: function(data){

	// 	// 					console.log(data);

	// 	// 					count++;

	// 	// 					var moduleElem = element.closest("div.module");
	// 	// 					moduleElem.find("input.module-meta").val("Uploading... ("+count+"/"+size+")").prop("disabled", true);

	// 	// 					if (count == size) {
										
	// 	// 						element.prev("button").prop("disabled", false);

	// 	// 						moduleElem.find("input.module-meta").val(code).prop("disabled", false);
	// 	// 						moduleElem.find("button.module-file").prop("disabled", false);

	// 	// 						element.val("");


	// 	// 					 //    var obj = {};
	// 	// 						// obj.code = code;

	// 	// 						// $.ajax({
	// 	// 						// 	url: "./process/combine.php",
	// 	// 						// 	data: obj,
	// 	// 						// 	type: "POST",
	// 	// 						// 	success: function(data){


	// 	// 						// 	}

	// 	// 						// });

	// 	// 					}

	// 	// 				}
	// 	// 			});	



	// 	// 		}


	// 	// 	}

	// 	// });




	// 	return false;



	//     var bytes = new Uint8Array( arrayBuffer );

	// 	for (var i = 0; i < size; i++) {



	// 	    var binary = '';

	// 	    var start = i * chunk;
	// 	    var end = i * chunk + chunk;


	// 	//     for (var j = start; j < end; j++) {
	// 	//         binary += String.fromCharCode( bytes[ j ] );
	// 	//     }			


	// 	    console.log(start + " - " + end);
	// 	    console.log(binary);


	// 	}



});


function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < 6; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

$(document).on("click", "#preview", function(){

	window.open("/view?code="+code); 

	// if (window.location.hostname == "cwc-generate.ckprototype.com") {

	// 	window.open("http://cwc-view.ckprototype.com/#"+hash); 

	// } else {


	// 	window.open("http://xai-view.ckprototype.com/#"+hash); 

	// }



});


var markdownBtn = null;

$(document).on("click", "button.module-markdown", function(){

	markdownBtn = $(this);

	var moduleElem = $(this).closest("div.module");
	var filename = moduleElem.find("input.module-meta").val();

	if (filename != "") {

		$.ajax({
			url: "./process/download.php",
			type: "GET",
			datatype: "text",
			data: {
				code: filename,
				path: true
			},
			success: function(data){

				var path = $.trim(data);

				$.ajax({
					url: path,
					type: "GET",
					dataType: "text",
					success: function(data){

						$("#module-markdown-text").val(data);

					}

				});



			}

		});	

	} else {

		$("#module-markdown-text").val("");

	}


});


$(document).on("click", "button.module-download", function(){

	var moduleElem = $(this).closest("div.module");

	if (moduleElem.find("input.module-meta").prop("disabled") == false) {

		var filename = moduleElem.find("input.module-meta").val();
		window.open("./process/download.php?code="+filename);

	}




});


$(document).on("click", "#module-markdown-submit", function(){

	var element = $(this);

	element.prop("disabled", true);

	var data = $("#module-markdown-text").val();

	$.ajax({
		url: "./process/generate_code.php",
		success: function(code){

			var code = $.trim(code);
			var file = code+".md";

		    var obj = {};
			obj.data = data;
			obj.length = data.length;
			obj.max = length;
			obj.index = 0;
			obj.code = code;
			obj.file = file;

			$.ajax({
				url: "./process/upload.php",
				data: obj,
				type: "POST",
				success: function(data){

					// count++;

					// var moduleElem = element.closest("div.module");
					// moduleElem.find("input.module-meta").val("Uploading... ("+count+"/"+length+")").prop("disabled", true);
							

				    var obj = {};
					obj.code = code;
					obj.name = file;
					obj.type = "text/markdown";

					$.ajax({
						url: "./process/combine.php",
						data: obj,
						type: "POST",
						success: function(data){

							$("#module-markdown-modal").modal("hide");
							$("#module-markdown-text").val("");
							
							element.prop("disabled", false);

							var moduleElem = markdownBtn.closest("div.module");
							moduleElem.find("input.module-meta").val(data).prop("disabled", false);
							moduleElem.find("button.module-file").prop("disabled", false);

							generateJson();

						}

					});


				}
			});	


		}
	});	


	// var data = body.substr(i * chunk, chunk);

 //    var obj = {};
	// obj.data = value;
	// obj.index = i;
	// obj.code = code;

	// $.ajax({
	// 	url: "./process/upload.php",
	// 	data: obj,
	// 	type: "POST",
	// 	success: function(data){

	// 		count++;

	// 		var moduleElem = element.closest("div.module");
	// 		moduleElem.find("input.module-meta").val("Uploading... ("+count+"/"+length+")").prop("disabled", true);
				

	// 	    var obj = {};
	// 		obj.code = code;
	// 		obj.name = file;
	// 		obj.type = type;

	// 		$.ajax({
	// 			url: "./process/combine.php",
	// 			data: obj,
	// 			type: "POST",
	// 			success: function(data){


	// 				element.prev("button").prop("disabled", false);

	// 				moduleElem.find("input.module-meta").val(code).prop("disabled", false);
	// 				moduleElem.find("button.module-file").prop("disabled", false);

	// 				element.val("");

	// 				generateJson();

	// 			}

	// 		});


	// 	}
	// });	





});




$(document).on("click", "#create_new", function(){

    var obj = {};

	$.ajax({
		url: "./process/new.php",
		data: obj,
		type: "POST",
		success: function(data){
		
			data = $.trim(data);

			window.location.href = "./?code="+data;

		},
		error: function(){



		}
	});	


});