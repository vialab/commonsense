
$(window).on("load", function(){

	$.ajaxSetup({
		cache: false
	});


	$("#layout-title").text("XAI: Modular Interface Generator");
	$("#layout-author").text("Chris Kim, Mohamed Amer, Tim Meo, Xiao Lin, Ryan Villamil");

	var optionpath = "./js/options-full.json";

	/*

	if (window.location.hostname == "cwc-generate.ckprototype.com") {

		$("#layout-title").text("Aesop Layout Generator");
		$("#layout-author").text("Chris Kim, Tim Meo, Mohamed Amer");

		var optionpath = "./js/options-cwc.json";

	} else {

		$("#layout-title").text("XAI: Modular Interface Generator");
		$("#layout-author").text("Chris Kim, Mohamed Amer, Tim Meo, Xiao Lin, Ryan Villamil");

		var optionpath = "./js/options.json";

	}

	*/


	$.ajax({
		url: optionpath,
		type: "GET",
		datatype: "json",
		success: function(data){

			moduleList = data;
			reloadJson();

			// hash = window.location.hash.replace("#", "").split("/")[0];

			// if (hash == "") {

			// 	var random = String(Math.random()).replace("0.", "");
			// 	hash = random;

			// 	$("#add_page").click();

			// } else {

			// 	reloadJson();

			// }

		}
	})





});

function reloadJson(){



	$.ajax({
		url: "./process/load.php",
		data:{
			code: code
		},
		success: function(data){

			data = $.trim(data);

			if (data == "") {

				$("#add_page").click();

			} else {

				var json = JSON.parse(data);

				console.log(json);

				$("#title").val(json.title);
				$("#author").val(json.author);



				$.ajax({
					url: "./module/page.html",
					success: function(data){

						var pageTemplate = $(data);


						$.ajax({
							url: "./module/column.html",
							success: function(data){

								var columnTemplate = $(data);

								$.ajax({
									url: "./module/module.html",
									success: function(data){

										var moduleTemplate = $(data);

										$.each(json.layout, function(i,o){


											var page = pageTemplate.clone();
											$("#pages").append(page);

											page.find("input.page-title").val(o.title);

											$.each(o.columns, function(k,q){


												var column = columnTemplate.clone();

												page.find(".columns").append(column);

												column.find("input.column-width").val(q.size).trigger("input");

												$.each(q.modules, function(j,p){

													var dom = moduleTemplate.clone();

													dom.find("h6 strong").text(p.name);
													dom.attr("module", p.name);

													dom.find("input.module-meta").val(p.meta);


													var moduleArray = p.name.split("/");

													if (moduleList[moduleArray[0]][moduleArray[1]].meta != true) {

														dom.find("div.module-meta-box").find("input").prop("disabled", true).attr("placeholder", "No Asset Allowed");
														dom.find("div.module-meta-box").find("button.module-file").prop("disabled", true).hide();

													}


													if (moduleList[moduleArray[0]][moduleArray[1]].markdown != true) {

														dom.find("div.module-meta-box").find("button.module-markdown").prop("disabled", true).hide();
														
													}



													column.find("div.module-list").append(dom);

												});



											});




										});



										$( ".module-list" ).sortable({
									      connectWith: ".module-list",
	            						placeholder: "ui-state-highlight",
									      update: function(){

											generateJson();

									      }
									    }).disableSelection();	

										generateJson();


									}

								});

							}

						});



					}	


				});

				
			}



		}

	});

	return false;

	$.ajax({
		url: "http://xai-data.ckprototype.com/specs/"+hash,
		success: function(data){





		}

	});

}