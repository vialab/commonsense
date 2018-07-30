callback.cwcAttribute = function(){

	$("#cwc_attribute_card").hide();
	$("#cwc_attribute_loading").show();

	$.ajax({
		url: "/modules/db/attribute/type.php",
		success: function(data){



			var types = JSON.parse(data);

			$.each(types, function(i,o){

				$("#cwc_attribute_type_list").append('<a class="dropdown-item cwc_attribute_add" data-db="'+o.ATTRIBUTE_TYPE_ID+'" href="#">'+o.NAME+'</a>');

			});

			$.ajax({
				url: "/modules/db/attribute/preset.php",
				success: function(data){



					var types = JSON.parse(data);

					$.each(types, function(i,o){

						$("#cwc_attribute_preset_list").append('<a class="dropdown-item cwc_attribute_preset_add" data-type="'+o.ATTRIBUTE_TYPE_ID+'" data-asset="'+o.ASSET_TYPE_ID+'" href="#"><span class="badge badge-dark label">'+o.LABEL+'</span> <span class="badge badge-light value">'+o.VALUE+'</span></a>');

					});

					$.ajax({
						url: "/modules/db/attribute/attachments.php",
						success: function(data){


							$("#cwc_asset_loading").hide();

							var types = JSON.parse(data);


							$.each(types, function(i,o){

								$("#cwc_attribute_attachment_list").append('<a class="dropdown-item cwc_attribute_attachment_add" data-db="'+o.ASSET_ID+'" data-type="'+o.CHARACTER_TYPE+'" data-category="'+o.CATEGORY+'" href="#"><span class="badge badge-dark label">'+o.CATEGORY+'</span> <span class="badge badge-light value">'+o.NAME+'</span></a>');

							});

						}
					});		

				}
			});

	

		}
	});




}



$(document).on("click", "i.cwc_asset_attribute", function(e){

	var id = $(this).closest("tr").data("db");

	$(this).closest("tr").addClass("table-info");	
	$(this).closest("tr").siblings().removeClass("table-info");	

	var type = $(this).closest("tr").data("type");
	var name = $(this).closest("tr").find("td.type").text();


	if ($("#cwc_attribute_selected").val() != id) {

		$("#cwc_attribute_selected").val(id);
		$("#cwc_attribute_list").empty();
		$("#cwc_attribute_card").show();
		$("#cwc_attribute_loading").hide();

		$("a.cwc_attribute_preset_add[data-asset='"+type+"']").show();
		$("a.cwc_attribute_preset_add[data-asset!='"+type+"']").hide();

		if ($("a.cwc_attribute_preset_add[data-asset='"+type+"']").length == 0) {

			$("#cwc_attribute_preset_list").parent().hide();

		} else {

			$("#cwc_attribute_preset_list").parent().show();
			$("#cwc_attribute_preset_list").scrollTop(0);

		}


		$("a.cwc_attribute_attachment_add[data-type='"+name+"']").show();
		$("a.cwc_attribute_attachment_add[data-type!='"+name+"']").hide();

		if ($("a.cwc_attribute_attachment_add[data-type='"+name+"']").length == 0) {

			$("#cwc_attribute_attachment_list").parent().hide();

		} else {

			$("#cwc_attribute_attachment_list").parent().show();
			$("#cwc_attribute_attachment_list").scrollTop(0);

		}


		poll.cwcAttribute();

	}


});




$(document).on("click", "a.cwc_attribute_add", function(e){

	e.preventDefault();

	var type_id = $(this).data("db");
	var actor_id = $("#cwc_attribute_selected").val();

	$.ajax({
		url: "/modules/db/attribute/add.php",
		type: "POST",
		data: {
			actor_id: actor_id,
			type_id: type_id
		},		
		success: function(data){

			poll.cwcAttribute();

		}
	});


});

$(document).on("click", "a.cwc_attribute_preset_add", function(e){

	e.preventDefault();

	var type_id = $(this).data("type");
	var actor_id = $("#cwc_attribute_selected").val();
	var label = $(this).find("span.badge.label").text();
	var value = $(this).find("span.badge.value").text();

	$.ajax({
		url: "/modules/db/attribute/add.php",
		type: "POST",
		data: {
			actor_id: actor_id,
			type_id: type_id,
			label: label,
			value: value
		},
		success: function(data){

			poll.cwcAttribute();

		}
	});

});


$(document).on("click", "a.cwc_attribute_attachment_add", function(e){

	e.preventDefault();

	var type_id = 10;
	var actor_id = $("#cwc_attribute_selected").val();
	var attachment_id = $(this).data("db");
	var label = $(this).find("span.badge.label").text();
	var value = $(this).find("span.badge.value").text();

	$.ajax({
		url: "/modules/db/attribute/add.php",
		type: "POST",
		data: {
			actor_id: actor_id,
			type_id: type_id,
			attachment_id: attachment_id,
			label: label,
			value: value
		},
		success: function(data){

			poll.cwcAttribute();

		}
	});

});





poll.cwcAttribute = function(){

	if ($("#cwc_attribute_list").attr("loading") == undefined && $("#cwc_attribute_selected").val() != "") {

		var msg = "hello world";

		$("#cwc_attribute_list").attr("loading", "true");

		$.ajax({
			url: "/modules/db/attribute/list.php",
			type: "POST",
			data: {
				id: $("#cwc_attribute_selected").val()
			},
			success: function(data){

				var cwcList = JSON.parse(data);

				$("#cwc_attribute_list tr[data-db]").each(function(){

					var id = $(this).data("db");


					if (cwcList[id] == undefined) {

						$(this).remove();

					} else {


						if (cwcList[id].VALUE != $(this).find("td.value").text()) {

							$(this).find("td.value").text(cwcList[id].VALUE);

						}



						if (cwcList[id].LABEL != $(this).find("td.label").text()) {

							$(this).find("td.label").text(cwcList[id].LABEL);

						}


					}

				});

				$.each(cwcList, function(i,o){

					if ($("#cwc_attribute_list tr[data-db='"+o.ATTRIBUTE_ID+"']").length == 0) {

						$("#cwc_attribute_list").append('<tr data-db="'+o.ATTRIBUTE_ID+'"><th scope="row">'+o.ATTRIBUTE_ID+'</th><td class="name">'+o.NAME+'</td><td class="label">'+o.LABEL+'</td><td class="value">'+o.VALUE+'</td><td class="text-right"><span class="text-primary">L </span><i class="fa fa-pencil-alt text-primary cwc_attribute_relabel"></i> <span class="text-primary">V </span><i class="fa fa-pencil-alt text-primary cwc_attribute_edit"></i> <i class="fa fa-times text-danger cwc_attribute_remove"></i></td></tr>');

					}

				});

				$("#cwc_attribute_list").removeAttr("loading");

				var element = $("div[module='db/attribute']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");		
				element.show();



			}
		});

	}

}



$(document).on("click", "i.cwc_attribute_remove", function(e){

	e.preventDefault();

	var response = confirm("Are you sure?");

	if (response == true) {

		var id = $(this).closest("tr").data("db");
		var rowDOM = $(this).closest("tr");

		$.ajax({
			url: "/modules/db/attribute/remove.php",
			type: "POST",
			data: {
				id: id,
			},			
			success: function(data){

				rowDOM.remove();


			}
		});


	}

});




$(document).on("click", "i.cwc_attribute_edit", function(e){

	e.preventDefault();

	var value = $(this).closest("tr").find("td.value").text();

	var response = prompt("Please provide the new value", value);

	if (response != null) {

		var id = $(this).closest("tr").data("db");
		var nameDOM = $(this).closest("tr").find(".value");
		
		$.ajax({
			url: "/modules/db/attribute/edit.php",
			type: "POST",
			data: {
				id: id,
				type: "value",
				value: response	
			},
			success: function(data){

				nameDOM.text(response);

			}
		});
		
	}

});



$(document).on("click", "i.cwc_attribute_relabel", function(e){

	e.preventDefault();

	var value = $(this).closest("tr").find("td.label").text();

	var response = prompt("Please provide the new label", value);

	if (response != null) {

		var id = $(this).closest("tr").data("db");
		var nameDOM = $(this).closest("tr").find(".label");
		
		$.ajax({
			url: "/modules/db/attribute/edit.php",
			type: "POST",
			data: {
				id: id,
				type: "label",
				value: response	
			},
			success: function(data){

				nameDOM.text(response);

			}
		});
		
	}

});

$(document).on("click", "#cwc_attribute_close", function(e){

	$("#cwc_attribute_card").hide();
	$("#cwc_attribute_loading").show();

	$("#cwc_attribute_selected").val("");	

	$("#cwc_actor_list tr.table-info").removeClass("table-info");	

	var element = $("div[module='db/attribute']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		


});
