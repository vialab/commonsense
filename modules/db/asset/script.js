function cwcAssetResize(){

	var element = $("div[module='cwc/asset']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		

}


callback.cwcProp = function(){

	// $("#cwc_asset_mode a:first").click();

}

$(document).on("click", "#cwc_asset_mode a", function(e){

	e.preventDefault();

	$(this).addClass("active");
	$(this).siblings().removeClass("active");

	var type = $(this).data("type");

	$("#cwc_actor_list tr[data-type='"+type+"']").show();
	$("#cwc_actor_list tr[data-type!='"+type+"']").hide();

	var characters = [];

	characters = [];

	$("#cwc_actor_list tr[data-type='1']").each(function(i,o){

		characters.push($(this).find(".type").text().trim());

	});


	cwcAssetResize();

	$("#cwc_asset_search").val("");

	$.ajax({
		url: "/modules/cwc/asset/type.php",
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

		$("#cwc_actor_list").attr("loading", "true");

		$.ajax({
			url: "/modules/cwc/asset/list.php",
			data: {
				session: session_id
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



$(document).on("click", "a.cwc_asset_add", function(e){

	e.preventDefault();

	var name = $(this).text();
	var id = $(this).data("db");

	$.ajax({
		url: "/modules/cwc/asset/add.php",
		type: "POST",
		data: {
			id: id,
			name: name,
			session: session_id
		},		
		success: function(data){

			$.each(poll, function(i,o){

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
			url: "/modules/cwc/asset/edit.php",
			type: "POST",
			data: {
				id: id,
				name: response	
			},
			success: function(data){

				nameDOM.text(response);

			}
		});
		
	}

});

$(document).on("click", "i.cwc_asset_remove", function(e){

	e.preventDefault();

	var response = confirm("Are you sure?");

	if (response == true) {

		var id = $(this).closest("tr").data("db");
		var rowDOM = $(this).closest("tr");

		$.ajax({
			url: "/modules/cwc/asset/remove.php",
			type: "POST",
			data: {
				id: id,
			},			
			success: function(data){

				rowDOM.remove();

				if (rowDOM.hasClass("table-info") == true) {

					$("div[module='cwc/attribute']").hide();

				}

				$("#cwc_attribute_selected").val("");	

				$("#cwc_graph_svg *[index='"+id+"']").remove();
				cwcAssetResize();

			}
		});


	}

});



$(document).on("click", "#cwc_asset_clear", function(e){

	var response = confirm("Would you like to clear the assets?");

	if (response == true) {

		$.ajax({
			url: "/modules/cwc/asset/clear.php",
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
