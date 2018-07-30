callback.cwcAttachment = function(){

	$("#cwc_attachment_card").hide();
	$("#cwc_attachment_loading").show();

	// $.ajax({
	// 	url: "/modules/db/attribute/type.php",
	// 	success: function(data){



	// 		var types = JSON.parse(data);

	// 		$.each(types, function(i,o){

	// 			$("#cwc_attachment_type_list").append('<a class="dropdown-item cwc_attachment_add" data-db="'+o.attachment_TYPE_ID+'" href="#">'+o.NAME+'</a>');

	// 		});

	// 		$.ajax({
	// 			url: "/modules/db/attribute/preset.php",
	// 			success: function(data){


	// 				$("#cwc_asset_loading").hide();

	// 				var types = JSON.parse(data);


	// 				$.each(types, function(i,o){

	// 					$("#cwc_attachment_preset_list").append('<a class="dropdown-item cwc_attachment_preset_add" data-type="'+o.attachment_TYPE_ID+'" data-asset="'+o.ASSET_TYPE_ID+'" href="#"><span class="badge badge-dark label">'+o.LABEL+'</span> <span class="badge badge-light value">'+o.VALUE+'</span></a>');

	// 				});

	// 			}
	// 		});

	// 	}
	// });




}
