callback.cwcEvent = function(){

   //  $('#cwc_event_list').sortable({
   //  	  start: function( event, ui ) {


			// $("#cwc_event_list").attr("loading", "true");

   //  	  },
   //  	  stop: function( event, ui ) {

			// cwcReorder();

   //  	  }
   //  });

}


$(document).on("click", "#cwc_event_add", function(e){

	e.preventDefault();

	// var order = $("#cwc_event_list tr:not(.timeline_row)").length+1;	

	// $.ajax({
	// 	url: "/modules/db/event/add.php",
	// 	type: "POST",
	// 	data: {
	// 		order: order
	// 	},		
	// 	success: function(data){


	// 	}
	// });

	// alert("Hello");
	// $("#cwc_event_prompt").show();


});


poll.cwcEvent = function(){

	if ($("#cwc_event_list").attr("loading") == undefined && $("#cwc_event_selected").val() != "") {

		var msg = "hello world";

		$("#cwc_event_list").attr("loading", "true");

		$.ajax({
			url: "/modules/db/event/list.php",
			data: {
				session: session_id
			},
			success: function(data){

				var cwcList = JSON.parse(data);

				// console.log(cwcList);

				$("#cwc_event_list tr[data-db]").each(function(){

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

						$(this).next("tr.timeline_row").remove();
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

							item.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-arrows-alt-h"></i> <i class="fa fa-walking"></i>';

						} else if (item.DIRECTION == 0) {

							item.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-chevron-right"></i> <i class="fa fa-walking"></i>';

						} else if (item.DIRECTION == 1) {

							item.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-chevron-left"></i> <i class="fa fa-walking"></i>';


						}

						// console.log(item.DIRECTION);
						// console.log($(this).find("td.direction").html());


						if (item.DIRECTION != $(this).find("td.direction").html()) {

							$(this).find("td.direction").html(item.DIRECTION);

						}

					}

				});

				$.each(cwcList, function(i,o){

					if ($("#cwc_event_list tr[data-db='"+o.INTERACTION_ID+"']").length == 0) {

						if (o.ACTOR_NAME_0 == null) {

							o.ACTOR_NAME_0 = "";

						}

						if (o.ACTOR_NAME_1 == null) {

							o.ACTOR_NAME_1 = "";

						}


						if (o.DIRECTION == 2) {

							o.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-arrows-alt-h"></i> <i class="fa fa-walking"></i>';

						} else if (o.DIRECTION == 0) {

							o.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-chevron-right"></i> <i class="fa fa-walking"></i>';

						} else if (o.DIRECTION == 1) {

							o.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-chevron-left"></i> <i class="fa fa-walking"></i>';

						}


						$("#cwc_event_list").append('<tr data-db="'+o.INTERACTION_ID+'"><th scope="row">'+o.INTERACTION_ID+'</th><!--<td class="order"><span>'+o.ORDER+'</span></td>--><td class="actor w-50"><i class="fa fa-user text-dark cwc_event_assign" column="ACTOR_ID_0"></i> <span class="actor0">'+o.ACTOR_NAME_0+'</span><br><i class="fa fa-walking text-dark cwc_event_assign" column="ACTOR_ID_1"></i> <span class="actor1">'+o.ACTOR_NAME_1+'</span></td><td class="description">'+o.DESCRIPTION+'</td><td class="direction">'+o.DIRECTION+'</td><td class="text-right w-25"><i class="fa fa-pencil-alt text-primary cwc_event_description"></i> <i class="fa fa-sync text-primary cwc_event_cycle"></i> <i class="fa fa-times text-danger cwc_event_remove"></i></td></tr><tr class="timeline_row"><td colspan="5" class="timeline"><div class="progress cwc_sequence_block_parent mb-0" data-db="'+o.INTERACTION_ID+'"><div class="progress-bar cwc_sequence_block" role="progressbar" style="width: '+cwcSequenceWidth+'px"><!--'+o.ACTOR_NAME_0+" "+o.ACTOR_NAME_1+'--></div></div></td></tr>');




					    $( ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"'] .cwc_sequence_block" ).draggable({
					    	grid: [ cwcSequenceWidth/4, 20 ],
					    	axis: "x",
					    	containment: ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"']",
							cursor: "move",
							stop: function( event, ui ) {


								var left = parseFloat($( ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"'] .cwc_sequence_block" ).css("left").replace("px", ""));

								var index = left / cwcSequenceWidth + 1;


								var db = o.INTERACTION_ID;

								$.ajax({
									url: "/modules/db/sequence/update.php",
									type: "POST",
									data: {
										db: db,
										index: index,
									},			
									success: function(data){



									}
								});



							}
					    });	


					    var offset = (o.ORDER - 1) * cwcSequenceWidth;

					    $( ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"'] .cwc_sequence_block" ).css("left", offset+"px");



					}

				});

				

				$("#cwc_event_list tr[data-db]").each(function(){

					var actor1 = $(this).find("span.actor0").text();
					var actor0 = $(this).find("span.actor1").text();

					// console.log(actor1);
					// console.log(actor0);

					if (actor0 == "" || actor1 == "") {

						$(this).addClass("table-danger");

					} else {

						$(this).removeClass("table-danger");

					}

				});


				$("#cwc_event_list").removeAttr("loading");


				var element = $("div[module='db/event']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");		





			}
		});

	}

}

var cwcSequenceWidth = 60;


$(document).on("click", "i.cwc_event_assign", function(e){


	// $("#cwc_event_prompt_column").text($(this).attr("column"));

	// $("#cwc_event_prompt").attr("column", $(this).attr("column"));
	// $("#cwc_event_prompt").attr("db", $(this).closest("tr").data("db"));
	// $("#cwc_event_prompt").show();


});


$(document).on("click", "#cwc_event_prompt_clear", function(e){

	e.preventDefault();

	cwcEventAssign("");



});

$(document).on("click", "#cwc_event_prompt_close", function(e){

	e.preventDefault();

	$("#cwc_event_prompt").removeAttr("column");
	$("#cwc_event_prompt").removeAttr("db");
	$("#cwc_event_prompt").hide();

});


$(document).on("click", "#cwc_graph_svg circle", function(e){

	if ($("#cwc_event_prompt").is(":visible") > 0) {

		var index = $(this).attr("index");

		var column = $("#cwc_event_prompt").attr("column");


		if (column == "ACTOR_ID_0" && $(this).attr("type") != "CHARACTER") {

			alert("Please select a character node.");
			return false;

		} else if (column == "ACTOR_ID_1" && $(this).attr("type") != "ACTION") {

			alert("Please select an action node.");
			return false;

		} else {

			cwcEventAssign(index);


		}

	}




});


function cwcEventAssign(index) {

	var column = $("#cwc_event_prompt").attr("column");
	var db = $("#cwc_event_prompt").attr("db");


	$.ajax({
		url: "/modules/db/event/assign.php",
		type: "POST",
		data: {
			column: column,
			db: db,
			index: index,
		},			
		success: function(data){

			$("#cwc_event_prompt").removeAttr("column");
			$("#cwc_event_prompt").removeAttr("db");
			$("#cwc_event_prompt").hide();

		}
	});


}


$(document).on("click", "i.cwc_event_remove", function(e){

	e.preventDefault();

	var response = confirm("Are you sure?");

	if (response == true) {

		$("#cwc_event_prompt").hide();

		var id = $(this).closest("tr").data("db");
		var rowDOM = $(this).closest("tr");

		$.ajax({
			url: "/modules/db/event/remove.php",
			type: "POST",
			data: {
				id: id,
			},			
			success: function(data){
				
				rowDOM.next("tr.timeline_row").remove();
				rowDOM.remove();

			}
		});


	}

});


$(document).on("click", "i.cwc_event_cycle", function(e){

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
		url: "/modules/db/event/direction.php",
		type: "POST",
		data: {
			id: id,
			direction: direction	
		},
		success: function(data){

			// nameDOM.text(response);
			poll.cwcEvent();

		}
	});
});


$(document).on("click", "i.cwc_event_description", function(e){

	e.preventDefault();

	var value = $(this).closest("tr").find("td.description").text();

	var response = prompt("Please provide the new description", value);

	if (response != null) {

		var id = $(this).closest("tr").data("db");
		var nameDOM = $(this).closest("tr").find(".description");
		
		$.ajax({
			url: "/modules/db/event/edit.php",
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


function cwcReorder(){

	$("#cwc_event_list").attr("loading", "true");

	var list = {};

	$("#cwc_event_list tr").each(function(i,o){

		var id = $(this).data("db");
		list[id] = i+1;

	});	

	console.log(list);

	$.ajax({
		url: "/modules/db/event/reorder.php",
		type: "POST",
		data: {
			list: list
		},			
		success: function(data){

			$("#cwc_event_list").removeAttr("loading");

		}
	});		

}