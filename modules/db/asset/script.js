function cwcAssetResize(){

	var element = $("div[module='db/asset']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		

}


callback.cwcProp = function(){

	// $("#cwc_asset_mode a:first").click();

	var meta = $("div[module='db/asset']").attr("meta");

	if (meta == "SCENE" || meta == "ALL" || meta == "NONE") {

		$("#cwc_asset_mode a[data-type='5']").remove();


		// $("#cwc_asset_clear").closest("div.card-body").hide();

	}

	if (meta == "SCENE") {

		$("#cwc_asset_dropdown_menu").remove();

		// $("#cwc_asset_mode a[data-type='1']").remove();

	}


	$("#cwc_asset_resolve_modal").on("hidden.bs.modal", function(){



		$("#cwc_actor_card").append($("#cwc_actor_parent"));
		$("#cwc_graph_svg_placeholder").prepend($("#cwc_graph_svg_conceptual_container"));




		$("#cwc_graph_svg_conceptual circle[index][asset='Generic']:visible").each(function(){

			var id = $(this).attr("index");

			$(".cwc_graph_svg_top *[actor1='"+id+"']").remove();
			$(".cwc_graph_svg_top *[actor0='"+id+"']").remove();
			$(".cwc_graph_svg_top *[index='"+id+"']").remove();

		});
		



		$("#cwc_asset_resolve_asset_placeholder style").remove();


		$("#cwc_listener_log").removeAttr("writing");
		$("#cwc_listener_log").removeAttr("loading");


		if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {



			$.each(trigger, function(i,o){

				o();

			});

		}


	});


}

$(document).on("click", "#cwc_asset_mode a", function(e){

	e.preventDefault();

	//$("#cwc_actor_list tr.swap").removeClass("swap");

	// $("#cwc_asset_dropdown_menu").text("Add").show();
	var type = $(this).data("type");

	if ($("#cwc_actor_list tr[data-type='"+type+"'].swap").length == 0) {

		$("#cwc_asset_dropdown_menu").text("Add");
		$("#cwc_asset_dropdown_menu").show();
		$("#cwc_asset_resolve").hide();

	} else if ($("#cwc_actor_list tr[data-type='"+type+"'].swap").length == 1) {

		$("#cwc_asset_dropdown_menu").text("Switch");
		$("#cwc_asset_dropdown_menu").hide();
		$("#cwc_asset_resolve").show();
		$("#cwc_asset_resolve").show().text("Resolve "+$("#cwc_actor_list tr.swap").length+" entity");

	} else {

		$("#cwc_asset_dropdown_menu").hide();
		$("#cwc_asset_resolve").show();
		$("#cwc_asset_resolve").show().text("Resolve "+$("#cwc_actor_list tr.swap").length+" entities");

	}

	// $("#cwc_asset_resolve").hide();

	$(this).addClass("active");
	$(this).siblings().removeClass("active");

	var label = $(this).data("label");
	var db = $(this).data("db");

	$("#cwc_actor_list tr[data-type='"+type+"']").show();
	$("#cwc_actor_list tr[data-type!='"+type+"']").hide();

	var characters = [];

	characters = [];

	$("#cwc_actor_list tr[data-type='1']").each(function(i,o){

		characters.push($(this).find(".type").text().trim());

	});


	$("#cwc_asset_add strong").text(label);
	$("#cwc_asset_add").attr("db", db);
	$("#cwc_asset_new").attr("db", db);



	cwcAssetResize();

	$("#cwc_asset_search").val("");

	var meta = $("div[module='db/asset']").attr("meta");

	// if (meta == "NONE") {

	// 	return false;

	// }

	$.ajax({
		url: "/modules/db/asset/type.php",
		data: {
			type: type,
			characters: characters
		},
		success: function(data){

			$("#cwc_asset_loading").hide();

			var types = JSON.parse(data);

			var parent = $("#cwc_asset_list").parent();

			$("#cwc_asset_list").remove();

			parent.append("<div id='cwc_asset_list'></div>");


			for (var i = 0; i < types.length; i++) {

				var o = types[i];

				var label = o.NAME;


				if (o.CHARACTER_TYPE != "" && o.CHARACTER_TYPE != null) {

					label += " <span class='badge badge-dark'>"+o.CHARACTER_TYPE+"</span>";

				}


				if (o.CATEGORY != "" && o.CATEGORY != null) {

					label += " <span class='badge badge-dark'>"+o.CATEGORY+"</span>";

				}



				var html = '<a class="dropdown-item cwc_asset_add" data-type="'+o.ASSET_TYPE_ID+'" data-db="'+o.ASSET_ID+'" data-type="'+o.CHARACTER_TYPE+'" data-category="'+o.CATEGORY+'" href="#" title="'+o.NAME.toLowerCase()+'">'+label+'</a>';

				$("#cwc_asset_list").append(html);
				

			}



			$("#cwc_asset_list").scrollTop(0);




		}
	});


});


$(document).on("keyup", "#cwc_asset_search", function(){

	var text = $("#cwc_asset_search").val().toLowerCase();

	if (text == 0) {

		$("#cwc_asset_list a.cwc_asset_add").show();

	} else {

		$("#cwc_asset_list a.cwc_asset_add[title*='"+text+"']").show();
		$("#cwc_asset_list a.cwc_asset_add:not([title*='"+text+"'])").hide();
		
	}




});

poll.cwcProp = function(){

	if ($("#cwc_actor_list").attr("loading") == undefined) {

		var msg = "hello world";
		var meta = $("div[module='db/asset']").attr("meta");

		$("#cwc_actor_list").attr("loading", "true");

		$.ajax({
			url: "/modules/db/asset/list.php",
			data: {
				session: session_id,
				meta: meta
			},
			success: function(data){

				var cwcList = JSON.parse(data);


				$("#cwc_actor_list tr[data-db]").each(function(){

					var id = $(this).data("db");



					if (cwcList[id] == undefined) {

						$(this).remove();

					} else {


						if (cwcList[id].ACTOR_NAME != $(this).find("td.name").text()) {

							$(this).find("td.name").text(cwcList[id].ACTOR_NAME);

						}


						if (cwcList[id].ASSET_NAME != $(this).find("span.cwc_actor_swap_text").text()) {

							$(this).find("span.cwc_actor_swap_text").text(cwcList[id].ASSET_NAME);
							$(this).attr("data-asset-name", cwcList[id].ASSET_NAME);

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

						if (o.META == null) {

							o.META = "";

						}

						if (o.TAG == null) {

							o.TAG = "";

						}

						$("#cwc_actor_list").append('<tr data-asset="'+o.ASSET_ID+'" data-type="'+o.ASSET_TYPE_ID+'" data-db="'+o.ACTOR_ID+'" data-asset-name="'+o.ASSET_NAME+'"'+"data-tag='"+o.TAG+"'"+'><th scope="row" class="align-middle">'+o.ACTOR_ID+"<br><small style='line-height:1;'>"+o.META+'<small></th><td class="type align-middle"><span class="cwc_actor_swap_text">'+o.ASSET_NAME+'</span> <a class="text-primary cwc_actor_swap"><i class="fa fa-pencil-alt"></i></a></td><td class="name  align-middle">'+o.ACTOR_NAME+'</td><td class="modalhide align-middle"><input readonly class="form-control form-control-sm" style="width:80px" type="number" min="0" max="359.9" step="0.1" value="'+o.RX+'"></td><td class="modalhide align-middle"><input readonly class="form-control form-control-sm" style="width:80px" type="number" min="0" max="359.9" step="0.1" value="'+o.RY+'"></td><td class="text-right align-middle"><i class="fa fa-tag text-success cwc_asset_attribute"></i> <i class="fa fa-pencil-alt text-primary cwc_asset_rename"></i> <i class="fa fa-times text-danger cwc_asset_remove"></i></td></tr>');



					}

				});

				$("#cwc_asset_mode a").each(function(){

					var db = $(this).data("type");
					var count = $("#cwc_actor_list tr[data-type='"+db+"']").length;

					$(this).find("span").remove();
					$(this).append(" <span>"+count+"</span>");


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

				if ($("div.module[module='db/tag']").length > 0) {

					$("#db-tag-tokens span").removeClass("marked");

					$("#cwc_actor_list tr[data-db][data-tag!='']").each(function(){

						var tag = $(this).attr("data-tag");
						tag = JSON.parse(tag);

						console.log(tag);	

						$.each(tag,function(i,o){

							var oArray = o.split(":");

							$("#db-tag-tokens>*:eq("+oArray[0]+")").children("*:eq("+oArray[1]+")").addClass("marked");

						});


					});



				}


			}
		});

	}

}



$(document).on("click", "a.cwc_asset_add", function(e){



	if ($("#cwc_actor_list tr.swap:visible").length == 0) {

		e.preventDefault();

		var name = $(this).text();
		var id = $(this).data("db");

		var newName = null;

		if ($("#cwc_asset_resolve_modal").hasClass("show")) {

			var index = $("#cwc_graph_svg_conceptual circle:visible[asset='Generic']").attr("index");
			var label = $("#cwc_graph_svg_conceptual text:visible[index='"+index+"'].label").text();

			newName = label.replace(index+": ", "");



		}

		$.ajax({
			url: "/modules/db/asset/add.php",
			type: "POST",
			data: {
				id: id,
				name: name,
				session: session_id,
				name2: newName
			},		
			success: function(data){


				$("#cwc_asset_dropdown_menu").text("Add");
				$("#cwc_asset_dropdown_menu").show();
				$("#cwc_asset_resolve").hide();

				$.each(poll, function(i,o){

					o();

				});
				

			}
		});

	} else {

		e.preventDefault();

		var name = $(this).text();
		var id = $(this).data("db");
		var db = $("#cwc_actor_list tr.swap:visible").attr("data-db");

		$.ajax({
			url: "/modules/db/asset/swap.php",
			type: "POST",
			data: {
				id: id,
				db: db,
				name: name,
				session: session_id
			},		
			success: function(data){


				$("#cwc_actor_list tr.swap").removeClass("swap");

				$("#cwc_asset_dropdown_menu").text("Add");
				$("#cwc_asset_dropdown_menu").show();
				$("#cwc_asset_resolve").hide();

				$.each(poll, function(i,o){

					o();

				});
				

			}
		});


	}

});



$(document).on("click", "#cwc_asset_new", function(e){

	e.preventDefault();

	var name = "New";
	var id = $(this).attr("db");
	var meta = $("div[module='db/asset']").attr("meta");

	$.ajax({
		url: "/modules/db/asset/add.php",
		type: "POST",
		data: {
			id: id,
			name: name,
			session: session_id,
			meta: meta
		},		
		success: function(data){

			$.each(poll, function(i,o){

				o();

			});
			
			$.each(static, function(i,o){

				o();

			});


		}
	});

});



$(document).on("click", "i.cwc_asset_rename", function(e){

	e.preventDefault();

	var value = $(this).closest("tr").find("td.name").text();

	var response = prompt("Please provide the new name", value);

	if (response != null) {

		var id = $(this).closest("tr").data("db");
		var nameDOM = $(this).closest("tr").find(".name");
		
		$.ajax({
			url: "/modules/db/asset/edit.php",
			type: "POST",
			data: {
				id: id,
				name: response	
			},
			success: function(data){

				nameDOM.text(response);

				$.each(static, function(i,o){

					o();

				});

			}
		});
		
	}

});

$(document).on("click", "i.cwc_asset_remove", function(e){

	e.preventDefault();

	if ($("div[module='visual/overlay']").length > 0) {

		var response = confirm("Are you sure?");


		if (response == true) {

			var id = $(this).closest("tr").data("db");
			var rowDOM = $(this).closest("tr");

			$.ajax({
				url: "/modules/db/asset/remove.php",
				type: "POST",
				data: {
					id: id,
				},			
				success: function(data){

					// window.location.reload();


					rowDOM.remove();

					if (rowDOM.hasClass("table-info") == true) {

						$("div[module='db/attribute']").hide();

					}

					$("#cwc_attribute_selected").val("");	

					$("#cwc_graph_svg *[index='"+id+"']").remove();
					cwcAssetResize();


					$("#visual-bbox-timeline").empty();
					$("#visual-video-canvas").empty();
					$("#visual-video-dots").empty();

					$.each(static, function(i,o){

						o();

					});					

				}
			});


		}


	} else {

		var response = confirm("Are you sure?");


		if (response == true) {

			var id = $(this).closest("tr").data("db");
			var rowDOM = $(this).closest("tr");

			$.ajax({
				url: "/modules/db/asset/remove.php",
				type: "POST",
				data: {
					id: id,
				},			
				success: function(data){

					rowDOM.remove();

					if (rowDOM.hasClass("table-info") == true) {

						$("div[module='db/attribute']").hide();

					}

					$("#cwc_attribute_selected").val("");	

					$("#cwc_graph_svg *[index='"+id+"']").remove();
					cwcAssetResize();

				}
			});


		}


	}



});



$(document).on("click", "#cwc_asset_clear", function(e){

	var response = confirm("Would you like to clear the assets?");

	if (response == true) {

		$.ajax({
			url: "/modules/db/asset/clear.php",
			type: "POST",
			data:{
				session: session_id
			},
			success: function(data){

				poll.cwcProp();
				$("#cwc_attribute_close").click();

			}			
		});		

	}


});


$(document).on("click", "a.cwc_actor_swap", function(e){

	$(this).closest("tr").toggleClass("swap");
	var type = $(this).closest("tr").data("type");

	if ($("#cwc_actor_list tr[data-type='"+type+"'].swap").length == 0) {

		$("#cwc_asset_dropdown_menu").text("Add");
		$("#cwc_asset_dropdown_menu").show();
		$("#cwc_asset_resolve").hide();

	} else if ($("#cwc_actor_list tr[data-type='"+type+"'].swap").length == 1) {

		$("#cwc_asset_dropdown_menu").text("Switch");
		$("#cwc_asset_dropdown_menu").hide();
		$("#cwc_asset_resolve").show();
		$("#cwc_asset_resolve").show().text("Resolve "+$("#cwc_actor_list tr.swap").length+" entity");

	} else {

		$("#cwc_asset_dropdown_menu").hide();
		$("#cwc_asset_resolve").show();
		$("#cwc_asset_resolve").show().text("Resolve "+$("#cwc_actor_list tr.swap").length+" entities");

	}



});




$(document).on("click", "button.cwc_graph_resolve_import", function(e){

	var db = $(this).attr("db");



	$.ajax({
		url: "/modules/db/asset/import.php",
		data: {
			db: db,
			session: session_id,				
		},
		type: "POST",
		success: function(data){



		}


	});	


});

$(document).on("click", "#cwc_asset_resolve", function(e){



	$("#cwc_asset_resolve_placeholder #cwc_graph_svg_conceptual>*").hide();
	

	$("#cwc_listener_log").removeAttr("writing");


	if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {

		$.each(trigger, function(i,o){

			o();

		});

	}


	var db = [];

	var swapIds = [];

	$("#cwc_actor_list tr.swap").each(function(){

		swapIds.push($(this).attr("data-db"));

	});

	$("#cwc_actor_parent tbody tr").each(function(){

		$("#cwc_asset_resolve_asset_placeholder").append("<style>#cwc_actor_parent tbody tr[data-db='"+$(this).attr("data-db")+"'] { display:none !important; }</style>")
		
		if (swapIds.indexOf($(this).attr("data-db")) == -1) {

			$("#cwc_asset_resolve_asset_placeholder").append("<style>.cwc_graph_svg_top *[index='"+$(this).attr("data-db")+"'],.cwc_graph_svg_top *[actor0='"+$(this).attr("data-db")+"'],.cwc_graph_svg_top *[actor1='"+$(this).attr("data-db")+"'] { display:none !important; }</style>");

		} else {



		}


	});




	$("#cwc_asset_resolve_placeholder").append($("#cwc_graph_svg_conceptual_container"));
	$("#cwc_asset_resolve_asset_placeholder").append($("#cwc_actor_parent"));

	var last = $("#cwc_actor_parent tbody tr:last").attr("data-db");



	$("#cwc_asset_resolve").hide();
	$("#cwc_graph_resolve").hide();


	$("#cwc_asset_resolve_modal").modal({
		keyboard: false,
		backdrop: "static",
	});




	$("#cwc_asset_resolve_nodes").empty();

	$("#cwc_actor_list tr.swap").each(function(){

		$("#cwc_asset_resolve_nodes").append("<li><strong class='resolve_id'>"+$(this).attr("data-db")+"</strong>: "+$(this).find("td:eq(0)").text()+" - <span class='resolve_name'>"+$(this).find("td:eq(1)").text()+"</span></li>")

	});




	$("#cwc_asset_resolve_table tbody tr.interaction").not(":first").remove();
	$("#cwc_asset_resolve_table tbody tr.actor").not(":first").remove();

	var resolution_name = [];

	$("span.resolve_name").each(function(){

		resolution_name.push($(this).text().trim());

	})


	// resolution_name = $.trim(resolution_name);
	// var resolution_data = null;

	$.ajax({
		url: "/modules/db/asset/resolution_load.php",
		data: {
			resolution_name: resolution_name
		},
		type: "GET",
		success: function(data){

			resolution_data = JSON.parse(data);

			if (resolution_data.length == 0) {

				$("#cwc_asset_resolve_loaded").hide();
				$("#cwc_asset_resolve_detected_table").hide();
				return false;

			} else {

				$("#cwc_asset_resolve_loaded").show();
				$("#cwc_asset_resolve_detected_table").show();

				$("#cwc_asset_resolve_rows").empty();

				$.each(resolution_data, function(i,o){

					var actors = [];
					var edges = [];
					var names = [];


					if (o.ACTORS != "null") {

						var actors = JSON.parse(o.ACTORS);

					}

					if (o.EDGES != "null") {

						var edges = JSON.parse(o.EDGES);

					}

					if (o.NAMES != "null") {

						var names = JSON.parse(o.NAMES);

					}


					var name = [];

					$.each(actors, function(j,p){

						name.push(p.name);

					});

					$("#cwc_asset_resolve_rows").append("<tr><td>"+o.RESOLUTION_ID+"</td><td>"+Object.keys(actors).length+" ("+ name.join(", ") +") </td><td>"+Object.keys(edges).length+"</td><td><button class='btn btn-primary btn-sm cwc_graph_resolve_import' db='"+o.RESOLUTION_ID+"'>Import</button></td></tr>")

				});

				return false;


				for (var i = 0; i < resolution_data.length - 1; i++) {

					$("#cwc_asset_resolve_addmore").click();




				}

				for (var i = 0; i < resolution_data.length; i++) {


					var entry = resolution_data[i];

					var row = $("#cwc_asset_resolve_table tbody tr.actor:eq("+i+")");
					row.find("select.cwc_asset_resolve_select_type").val(entry.type);
					row.find("input").val(entry.name);


					var direction = parseInt(entry.direction);


					if (direction == 0) {

						row.next("tr.interaction").find("td:first").html('<i class="fa fa-2x text-muted fa-chevron-down"></i>');

					} else if (direction == 1) {

						row.next("tr.interaction").find("td:first").html('<i class="fa fa-2x text-muted fa-chevron-up"></i>');

					} else if (direction == 2) {

						row.next("tr.interaction").find("td:first").html('<i class="fa fa-2x text-muted fa-arrows-alt-v"></i>');

					}


					row.next("tr.interaction").attr("direction", direction);					


				}


				var characters = [];

				characters = [];
				var characterIds = [];

				var count = 0;


				for (var i = 0; i < resolution_data.length; i++) {

					var entry = resolution_data[i];

					if (entry.type == 1) {

						characterIds.push(entry.asset);

					}

				}

				$.ajax({
					url: "/modules/db/asset/type.php",
					data: {
						type: 1,
					},
					success: function(data){

						var types = JSON.parse(data);

						for (var i = 0; i < types.length; i++) {

							var o = types[i];

							if (characterIds.indexOf(o.ASSET_ID) > -1) {

								characters.push(o.NAME);

							}


						}

						loadSelect();

					}
				});


				var rowNumber = 0;

				function loadSelect(){

					if (resolution_data.length == 0) {


					} else {

						var entry = resolution_data[0];
						var row = $("#cwc_asset_resolve_table tbody tr.actor:eq("+rowNumber+")");

						$.ajax({
							url: "/modules/db/asset/type.php",
							data: {
								type: entry.type,
								characters: characters
							},
							success: function(data){


								var types = JSON.parse(data);

								row.find("select.cwc_asset_resolve_select_asset").empty();
								row.find("select.cwc_asset_resolve_select_asset").append("<option value=''>(Select one)</option>");

								for (var i = 0; i < types.length; i++) {

									var o = types[i];

									var label = o.NAME;

									if (o.CHARACTER_TYPE != "" && o.CHARACTER_TYPE != null) {

										label += " ("+o.CHARACTER_TYPE+")";

									}


									if (o.CATEGORY != "" && o.CATEGORY != null) {

										label += " ("+o.CATEGORY+")";

									}


									row.find("select.cwc_asset_resolve_select_asset").append("<option value='"+o.ASSET_ID+"'>"+label+"</option>");
									row.find("select.cwc_asset_resolve_select_asset").val(entry.asset);

								}


								rowNumber++;
								resolution_data.splice(0,1);
								loadSelect();

							}
						});




					}



				}

				// loadSelect();




			}

		}


	});



	$("#cwc_graph_svg_conceptual rect[index], #cwc_graph_svg_conceptual circle[index]").removeClass("active");
	$("#cwc_actor_list tr.swap").removeClass("swap");

	$("#cwc_asset_dropdown_menu").text("Add");
	$("#cwc_asset_dropdown_menu").show();


	return false;


	var type = $("#cwc_asset_mode a.active").attr("data-type");
	var characters = [];

	characters = [];

	$("#cwc_actor_list tr[data-type='1']").each(function(i,o){

		characters.push($(this).find(".type").text().trim());

	});




	$.ajax({
		url: "/modules/db/asset/type.php",
		data: {
			type: type,
			characters: characters
		},
		success: function(data){


			$("#cwc_asset_resolve_table tbody tr:not(:first)").remove();

			var types = JSON.parse(data);

			$("select.cwc_asset_resolve_select_asset").empty();
			$("select.cwc_asset_resolve_select_asset").append("<option value=''>(Select one)</option>");

			for (var i = 0; i < types.length; i++) {

				var o = types[i];

				var label = o.NAME;

				if (o.CHARACTER_TYPE != "" && o.CHARACTER_TYPE != null) {

					label += " ("+o.CHARACTER_TYPE+")";

				}


				if (o.CATEGORY != "" && o.CATEGORY != null) {

					label += " ("+o.CATEGORY+")";

				}


				$("select.cwc_asset_resolve_select_asset").append("<option value='"+o.ASSET_ID+"'>"+label+"</option>");


				

			}



		}
	});


});





$(document).on("click", "#cwc_asset_resolve_addmore", function(e){

	var clone = $("#cwc_asset_resolve_table tbody tr.actor:last").clone();
	clone.find("input").val("");
	clone.find("select.cwc_asset_resolve_select_asset").html("<option value=''>(Empty)</option>");

	$("#cwc_asset_resolve_table tbody").append(clone);

	var clone = $("#cwc_asset_resolve_table tbody tr.interaction:last").clone();
	$("#cwc_asset_resolve_table tbody").append(clone);


});

$(document).on("click", "button.cwc_asset_resolve_remove", function(e){

	if ($("#cwc_asset_resolve_table tbody tr.actor").length > 1) {

		$(this).closest("tr").next("tr.interaction").remove();
		$(this).closest("tr").remove();

	}




});


$(document).on("click", "button.cwc_asset_resolve_direction", function(e){

	var direction = parseInt($(this).closest("tr.interaction").attr("direction"));

	if (direction == 2) {

		direction = 0;
		$(this).closest("tr.interaction").find("td:first").html('<i class="fa fa-2x text-muted fa-chevron-down"></i>');

	} else if (direction == 0) {

		direction = 1;
		$(this).closest("tr.interaction").find("td:first").html('<i class="fa fa-2x text-muted fa-chevron-up"></i>');

	} else if (direction == 1) {

		direction = 2;
		$(this).closest("tr.interaction").find("td:first").html('<i class="fa fa-2x text-muted fa-arrows-alt-v"></i>');

	}


	$(this).closest("tr.interaction").attr("direction", direction);



});

$(document).on("change", ".cwc_asset_resolve_select_type", function(e){

	var type = $(this).val();



	var row = $(this).closest("tr");

	if (type == "") {

		row.find("select.cwc_asset_resolve_select_asset").empty();
		return false;
		
	}


	var characters = [];

	characters = [];

	$("#cwc_asset_resolve_table tr.actor").each(function(){

		if ($(this).find(".cwc_asset_resolve_select_type").val() == 1) {

			var asset = $(this).find(".cwc_asset_resolve_select_asset").val();
			var name = $(this).find(".cwc_asset_resolve_select_asset").find("option[value='"+asset+"']").text();

			characters.push(name);

		}

	});



	$.ajax({
		url: "/modules/db/asset/type.php",
		data: {
			type: type,
			characters: characters
		},
		success: function(data){



			var types = JSON.parse(data);

			row.find("select.cwc_asset_resolve_select_asset").empty();
			row.find("select.cwc_asset_resolve_select_asset").append("<option value=''>(Select one)</option>");

			for (var i = 0; i < types.length; i++) {

				var o = types[i];

				var label = o.NAME;

				if (o.CHARACTER_TYPE != "" && o.CHARACTER_TYPE != null) {

					label += " ("+o.CHARACTER_TYPE+")";

				}


				if (o.CATEGORY != "" && o.CATEGORY != null) {

					label += " ("+o.CATEGORY+")";

				}


				row.find("select.cwc_asset_resolve_select_asset").append("<option value='"+o.ASSET_ID+"'>"+label+"</option>");


				

			}



		}
	});


});

$(document).on("change", ".cwc_asset_resolve_select_asset", function(e){

	var id = $(this).val();
	$(this).closest("tr").find("input").val($(this).closest("tr").find("select option[value='"+id+"']").text());


});


$(document).on("click", "button#cwc_asset_resolve_discard", function(e){


	var max = $("#cwc_graph_svg_conceptual circle[index][asset!='Generic']:visible").length;
	var count = 0;

	if (max == 0){

		$("#cwc_listener_log").removeAttr("writing");

		if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {

			$.each(trigger, function(i,o){

				o();

			});

		}

		$("#cwc_asset_resolve_modal").modal("hide");

	} else {

		$("#cwc_graph_svg_conceptual circle[index][asset!='Generic']:visible").each(function(){

			var id = $(this).attr("index");

			$(".cwc_graph_svg_top *[actor1='"+id+"']").remove();
			$(".cwc_graph_svg_top *[actor0='"+id+"']").remove();
			$(".cwc_graph_svg_top *[index='"+id+"']").remove();

			$.ajax({
				url: "/modules/db/asset/remove.php",
				type: "POST",
				data: {
					id: id,
				},			
				success: function(data){


					count++;

					if (max == count) {

						$("#cwc_listener_log").removeAttr("writing");

						if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {

							$.each(trigger, function(i,o){

								o();

							});

						}

						$("#cwc_asset_resolve_modal").modal("hide");

					}



				}

			});


		});

	}




			// $.ajax({
			// 	url: "/modules/db/asset/remove.php",
			// 	type: "POST",
			// 	data: {
			// 		id: id,
			// 	},			
			// 	success: function(data){



			// 	}

			// });


});


$(document).on("click", "button#cwc_asset_resolve_save", function(e){

	if ($("#cwc_graph_svg_conceptual circle[index][asset!='Generic']:visible").length == 0) {

		alert("Create at least one node.");
		return false;

	}

	var target = [];
	var names = [];

	var newNodes = [];
	var newEdges = [];
	var oldNodes = [];



	$("#cwc_graph_svg_conceptual circle[index]:visible").each(function(){

		var id = $(this).attr("index");
		target.push(id);

	});


	$("span.resolve_name").each(function(){

		names.push($(this).text().trim());

	})	

	var actorAsset = {};
	var edges = {};

	var actors = {};

	$("#cwc_graph_svg_conceptual circle[index][asset!='Generic']:visible").each(function(){

		var id = $(this).attr("index");
		var asset = $("#cwc_actor_list tr[data-db='"+id+"']").attr("data-asset");

		var item = {};

		item.name = $("#cwc_actor_list tr[data-db='"+id+"']").attr("data-asset-name");
		item.asset = asset;
		item.actor = id;

		actorAsset[id] = asset;

		actors[id] = item;

	});


	$("#cwc_graph_svg_conceptual circle[index][asset!='Generic']:visible").each(function(){

		var id = $(this).attr("index");
		var asset = $("#cwc_actor_list tr[data-db='"+id+"']").attr("data-asset");

		$(".cwc_graph_svg_top *[actor1='"+id+"'], .cwc_graph_svg_top *[actor2='"+id+"']").each(function(){

			var edge = {};
			edge.actor0 = $(this).attr("actor0");
			edge.actor1 = $(this).attr("actor1");
			edge.asset0 = actorAsset[$(this).attr("actor0")];
			edge.asset1 = actorAsset[$(this).attr("actor1")];
			edge.direction = $(this).attr("direction");
			edge.type = $(this).attr("type");

			edges[$(this).attr("index")] = edge;


		});


	});


	// console.log(edges);
	// console.log(actors);



	$("#cwc_listener_log").attr("writing", "true");
	$("#cwc_listener_log").attr("loading", "true");




	$.ajax({
		url: "/modules/db/asset/resolve.php",
		data: {
			target: target,
			names: names,
			session: session_id,				
			actors: actors,
			edges: edges,
		},
		type: "POST",
		success: function(data){


			// return false;

			$("#cwc_asset_resolve_modal").modal("hide");


		}

	});



	return false;


	var target = [];
	var list = [];
	var resolution_name = "";

	var pass = true;

	$("strong.resolve_id").each(function(){

		target.push(parseInt($(this).text()));

	})

	$("span.resolve_name").each(function(){

		resolution_name += " "+$(this).text().trim();

	})

	resolution_name = $.trim(resolution_name);



	// resolution_name

	$("#cwc_asset_resolve_table tbody tr.actor").each(function(){

		var item = {};
		item.type = $(this).find("select.cwc_asset_resolve_select_type").val();
		item.asset = $(this).find("select.cwc_asset_resolve_select_asset").val();
		item.direction = parseInt($(this).next("tr.interaction").attr("direction"));
		item.name = $(this).find("input").val();

		if (item.asset == "" || item.name == "") {

			alert("Please complete the fields.");

			pass = false;
			return false;

		}

		list.push(item);

	});

	if (pass == true) {


		$.ajax({
			url: "/modules/db/asset/resolve.php",
			data: {
				list: list,
				session: session_id,				
				target: target,
				resolution_name: resolution_name
			},
			type: "POST",
			success: function(data){

				console.log(data);
				$("#cwc_asset_resolve_modal").modal("hide");

				$("#cwc_actor_list tr.swap").removeClass("swap");

				$("#cwc_asset_dropdown_menu").text("Add");
				$("#cwc_asset_dropdown_menu").show();
				$("#cwc_asset_resolve").hide();

				$("#cwc_graph_svg_conceptual rect[index], #cwc_graph_svg_conceptual circle[index]").removeClass("active");
				$("#cwc_graph_resolve").hide();

				$("#cwc_actor_list").removeAttr("loading");
				$("#cwc_actor_list").removeAttr("writing");

				if ($("#cwc_listener_log").attr("loading") == undefined && $("#cwc_listener_log").attr("writing") == undefined) {

					$.each(trigger, function(i,o){

						o();

					});

				}

			}


		});


	}


});


$(document).on("click", "button#cwc_asset_import", function(e){

	var button = $(this);

	var scene = parseInt(code.replace("LAYOUT","").replace("GRAPH",""));

	function pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}	

	var scene = pad(scene, 3);

	button.prop("disabled", true);


	$.ajax({
		url: "/modules/db/asset/import_json.php",
		data: {
			scene: scene,
			session: session_id,
			mode: "characters"
		},
		type: "POST",
		success: function(data){


			button.prop("disabled", false);
			button.hide();

		}
	})




});