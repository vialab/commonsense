callback.cwcConnection = function(){

    $('#cwc_connection_list').sortable({
    	  start: function( event, ui ) {


			$("#cwc_connection_list").attr("loading", "true");

    	  },
    	  stop: function( event, ui ) {

			cwcConnectionReorder();

    	  }
    });

}


$(document).on("click", "#cwc_connection_add", function(e){

	e.preventDefault();

	var order = $("#cwc_connection_list tr").length+1;	

	$.ajax({
		url: "/modules/db/connection/add.php",
		type: "POST",
		data: {
			order: order
		},		
		success: function(data){


		}
	});


});


poll.cwcConnection = function(){

	if ($("#cwc_connection_list").attr("loading") == undefined && $("#cwc_connection_selected").val() != "") {

		var msg = "hello world";


		$("#cwc_connection_list").attr("loading", "true");

		$.ajax({
			url: "/modules/db/connection/list.php",
			data: {
				session: session_id
			},			
			success: function(data){

				var cwcList = JSON.parse(data);


				$("#cwc_connection_list tr[data-db]").each(function(){

					var id = $(this).data("db");

					var pass = false;
					var item = null;

					$.each(cwcList, function(i,o){

						if (o.INTERACTION_ID == id) {

							pass = true;
							item = o;
							return false;

						}

					});

					if (pass == false) {

						$(this).remove();

					} else {


						if (item.ORDER != $(this).find("td.order").text()) {

							$(this).find("td.order span").text(item.ORDER);

						}

						if (item.ACTOR_NAME_0 != $(this).find("span.actor0").text()) {

							$(this).find("span.actor0").text(item.ACTOR_NAME_0);

						}


						if (item.ACTOR_NAME_1 != $(this).find("span.actor1").text()) {

							$(this).find("span.actor1").text(item.ACTOR_NAME_1);

						}





						if (item.DIRECTION == 2) {

							item.DIRECTION = '<span class="badge badge-dark">1</span> <i class="fa text-muted fa-arrows-alt-h"></i> <span class="badge badge-dark">2</span>';

						} else if (item.DIRECTION == 0) {

							item.DIRECTION = '<span class="badge badge-dark">1</span> <i class="fa text-muted fa-chevron-right"></i> <span class="badge badge-dark">2</span>';

						} else if (item.DIRECTION == 1) {

							item.DIRECTION = '<span class="badge badge-dark">1</span> <i class="fa text-muted fa-chevron-left"></i> <span class="badge badge-dark">2</span>';

						}


						// console.log(item.DIRECTION);
						// console.log($(this).find("td.direction").html());


						if (item.DIRECTION != $(this).find("td.direction").html()) {

							$(this).find("td.direction").html(item.DIRECTION);

						}


					}

				});

				$.each(cwcList, function(i,o){

					if ($("#cwc_connection_list tr[data-db='"+o.INTERACTION_ID+"']").length == 0) {

						if (o.ACTOR_NAME_0 == null) {

							o.ACTOR_NAME_0 = "";

						}

						if (o.ACTOR_NAME_1 == null) {

							o.ACTOR_NAME_1 = "";

						}




						if (o.DIRECTION == 2) {

							o.DIRECTION = '<span class="badge badge-dark">1</span> <i class="fa text-muted fa-arrows-alt-h"></i> <span class="badge badge-dark">2</span>';

						} else if (o.DIRECTION == 0) {

							o.DIRECTION = '<span class="badge badge-dark">1</span> <i class="fa text-muted fa-chevron-right"></i> <span class="badge badge-dark">2</span>';

						} else if (o.DIRECTION == 1) {

							o.DIRECTION = '<span class="badge badge-dark">1</span> <i class="fa text-muted fa-chevron-left"></i> <span class="badge badge-dark">2</span>';

						}


						$("#cwc_connection_list").append('<tr data-db="'+o.INTERACTION_ID+'"><th scope="row">'+o.INTERACTION_ID+'</th><td class="order"><span>'+o.ORDER+'</span></td><td class="actor w-50"><span class="badge badge-dark">1</span> <span class=" actor0">'+o.ACTOR_NAME_0+'</span><br><span class="badge badge-dark">2</span> <span class=" actor1">'+o.ACTOR_NAME_1+'</span></td><td class="description">'+o.DESCRIPTION+'</td><td class="direction">'+o.DIRECTION+'</td><td class="text-right w-25"><i class="fa fa-pencil-alt text-primary cwc_connection_description"></i> <i class="fa fa-sync text-primary cwc_connection_cycle"></i> <i class="fa fa-times text-danger cwc_connection_remove"></i></td></tr>');

					}

				});

				

				$("#cwc_connection_list tr[data-db]").each(function(){

					var actor1 = $(this).find("span.actor1").text();
					var actor0 = $(this).find("span.actor0").text();

					if (actor0 == "" || actor1 == "") {

						$(this).addClass("table-danger");

					} else {

						$(this).removeClass("table-danger");

					}

				});


				$("#cwc_connection_list").removeAttr("loading");


				var element = $("div[module='db/connection']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");		





			}
		});

	}

}



$(document).on("click", "i.cwc_connection_assign", function(e){


});


$(document).on("click", "#cwc_connection_prompt_clear", function(e){

	e.preventDefault();

	cwcConnectionAssign("");



});

$(document).on("click", "#cwc_connection_prompt_close", function(e){

	e.preventDefault();

	$("#cwc_connection_prompt").removeAttr("column");
	$("#cwc_connection_prompt").removeAttr("db");
	$("#cwc_connection_prompt").hide();

});


$(document).on("click", "#cwc_graph_svg circle", function(e){

	if ($("#cwc_connection_prompt").is(":visible") > 0) {

		var index = $(this).attr("index");

		var column = $("#cwc_connection_prompt").attr("column");


		if (column == "ACTOR_ID_0" && $(this).attr("type") != "CHARACTER" && $(this).attr("type") != "PROP") {

			alert("Please select a character or a prop node.");
			return false;

		} else if (column == "ACTOR_ID_1" && $(this).attr("type") != "POSITION") {

			alert("Please select a position node.");
			return false;

		} else {

			cwcConnectionAssign(index);


		}

	}

});


function cwcConnectionAssign(index) {

	var column = $("#cwc_connection_prompt").attr("column");
	var db = $("#cwc_connection_prompt").attr("db");


	$.ajax({
		url: "/modules/db/connection/assign.php",
		type: "POST",
		data: {
			column: column,
			db: db,
			index: index,
		},			
		success: function(data){

			$("#cwc_connection_prompt").removeAttr("column");
			$("#cwc_connection_prompt").removeAttr("db");
			$("#cwc_connection_prompt").hide();


		}
	});


}


$(document).on("click", "i.cwc_connection_remove", function(e){

	e.preventDefault();

	var response = confirm("Are you sure?");

	if (response == true) {

		$("#cwc_connection_prompt").hide();

		var id = $(this).closest("tr").data("db");
		var rowDOM = $(this).closest("tr");

		$.ajax({
			url: "/modules/db/connection/remove.php",
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



$(document).on("click", "i.cwc_connection_cycle", function(e){

	var nameDOM = $(this).closest("tr").find(".direction");
	var id = $(this).closest("tr").data("db");

	var direction = 0;

	if (nameDOM.find("i.fa-arrows-alt-h").length > 0) {

		var direction = 0;

	} else if (nameDOM.find("i.fa-chevron-right").length > 0) {

		var direction = 1;

	} else if (nameDOM.find("i.fa-chevron-left").length > 0) {

		var direction = 2;

	}

	$.ajax({
		url: "/modules/db/connection/direction.php",
		type: "POST",
		data: {
			id: id,
			direction: direction	
		},
		success: function(data){

			// nameDOM.text(response);
			poll.cwcConnection();

		}
	});
});

$(document).on("click", "i.cwc_connection_description", function(e){

	e.preventDefault();

	var value = $(this).closest("tr").find("td.description").text();

	var response = prompt("Please provide the new description", value);

	if (response != null) {

		var id = $(this).closest("tr").data("db");
		var nameDOM = $(this).closest("tr").find(".description");
		
		$.ajax({
			url: "/modules/db/connection/edit.php",
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



function cwcConnectionReorder(){

	$("#cwc_connection_list").attr("loading", "true");

	var list = {};

	$("#cwc_connection_list tr").each(function(i,o){

		var id = $(this).data("db");
		list[id] = i+1;

	});	

	console.log(list);

	$.ajax({
		url: "/modules/db/connection/reorder.php",
		type: "POST",
		data: {
			list: list
		},			
		success: function(data){

			$("#cwc_connection_list").removeAttr("loading");

		}
	});		

}