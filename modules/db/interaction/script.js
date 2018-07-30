callback.cwcInteraction = function(){

    $('#cwc_interaction_list').sortable({
    	  start: function( event, ui ) {


			$("#cwc_interaction_list").attr("loading", "true");

    	  },
    	  stop: function( event, ui ) {

			cwcReorder();

    	  }
    });

}


$(document).on("click", "#cwc_interaction_add", function(e){

	e.preventDefault();

	var order = $("#cwc_interaction_list tr").length+1;	

	$.ajax({
		url: "/modules/cwc/interaction/add.php",
		type: "POST",
		data: {
			order: order
		},		
		success: function(data){


		}
	});


});


poll.cwcInteraction = function(){

	if ($("#cwc_interaction_list").attr("loading") == undefined && $("#cwc_interaction_selected").val() != "") {

		var msg = "hello world";

		$("#cwc_interaction_list").attr("loading", "true");

		$.ajax({
			url: "/modules/cwc/interaction/list.php",
			success: function(data){

				var cwcList = JSON.parse(data);

				$("#cwc_interaction_list tr[data-db]").each(function(){

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

						if (item.ACTOR_NAME_0 != $(this).find("td.actor0").text()) {

							$(this).find("td.actor0 span").text(item.ACTOR_NAME_0);

						}


						if (item.ACTOR_NAME_1 != $(this).find("td.actor1").text()) {

							$(this).find("td.actor1 span").text(item.ACTOR_NAME_1);

						}


					}

				});

				$.each(cwcList, function(i,o){

					if ($("#cwc_interaction_list tr[data-db='"+o.INTERACTION_ID+"']").length == 0) {

						if (o.ACTOR_NAME_0 == null) {

							o.ACTOR_NAME_0 = "";

						}

						if (o.ACTOR_NAME_1 == null) {

							o.ACTOR_NAME_1 = "";

						}


						$("#cwc_interaction_list").append('<tr data-db="'+o.INTERACTION_ID+'"><th scope="row">'+o.INTERACTION_ID+'</th><td class="order"><span>'+o.ORDER+'</span></td><td class="actor0"><i class="fa fa-user text-primary cwc_interaction_assign" column="ACTOR_ID_0"></i> <span>'+o.ACTOR_NAME_0+'</span></td><td class="actor1"><i class="fa fa-user text-primary cwc_interaction_assign" column="ACTOR_ID_1"></i> <span>'+o.ACTOR_NAME_1+'</span></td><td class="description">'+o.DESCRIPTION+'</td><td class="text-right w-25"><i class="fa fa-pencil-alt text-primary cwc_interaction_description"></i> <i class="fa fa-times text-danger cwc_interaction_remove"></i></td></tr>');

					}

				});

				

				$("#cwc_interaction_list tr[data-db]").each(function(){

					var actor1 = $(this).find("td.actor1 span").text();
					var actor0 = $(this).find("td.actor0 span").text();

					if (actor0 == "" || actor1 == "") {

						$(this).addClass("table-danger");

					} else {

						$(this).removeClass("table-danger");

					}

				});


				$("#cwc_interaction_list").removeAttr("loading");


				var element = $("div[module='cwc/interaction']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");		





			}
		});

	}

}



$(document).on("click", "i.cwc_interaction_assign", function(e){


	$("#cwc_interaction_prompt_column").text($(this).attr("column"));

	$("#cwc_interaction_prompt").attr("column", $(this).attr("column"));
	$("#cwc_interaction_prompt").attr("db", $(this).closest("tr").data("db"));
	$("#cwc_interaction_prompt").show();

});


$(document).on("click", "#cwc_interaction_prompt_clear", function(e){

	e.preventDefault();

	cwcInteractionAssign("");



});

$(document).on("click", "#cwc_interaction_prompt_close", function(e){

	e.preventDefault();

	$("#cwc_interaction_prompt").removeAttr("column");
	$("#cwc_interaction_prompt").removeAttr("db");
	$("#cwc_interaction_prompt").hide();

});


$(document).on("click", "#cwc_graph_svg circle", function(e){

	var index = $(this).attr("index");

	if ($("#cwc_interaction_prompt").is(":visible") > 0) {

		cwcInteractionAssign(index);

	}

});


function cwcInteractionAssign(index) {

	var column = $("#cwc_interaction_prompt").attr("column");
	var db = $("#cwc_interaction_prompt").attr("db");


	$.ajax({
		url: "/modules/cwc/interaction/assign.php",
		type: "POST",
		data: {
			column: column,
			db: db,
			index: index,
		},			
		success: function(data){

			$("#cwc_interaction_prompt").removeAttr("column");
			$("#cwc_interaction_prompt").removeAttr("db");
			$("#cwc_interaction_prompt").hide();


		}
	});


}


$(document).on("click", "i.cwc_interaction_remove", function(e){

	e.preventDefault();

	var response = confirm("Are you sure?");

	if (response == true) {

		var id = $(this).closest("tr").data("db");
		var rowDOM = $(this).closest("tr");

		$.ajax({
			url: "/modules/cwc/interaction/remove.php",
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



$(document).on("click", "i.cwc_interaction_description", function(e){

	e.preventDefault();

	var value = $(this).closest("tr").find("td.description").text();

	var response = prompt("Please provide the new description", value);

	if (response != null) {

		var id = $(this).closest("tr").data("db");
		var nameDOM = $(this).closest("tr").find(".description");
		
		$.ajax({
			url: "/modules/cwc/interaction/edit.php",
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

	$("#cwc_interaction_list").attr("loading", "true");

	var list = {};

	$("#cwc_interaction_list tr").each(function(i,o){

		var id = $(this).data("db");
		list[id] = i+1;

	});	

	$.ajax({
		url: "/modules/cwc/interaction/reorder.php",
		type: "POST",
		data: {
			list: list
		},			
		success: function(data){

			$("#cwc_interaction_list").removeAttr("loading");

		}
	});		

}