/*callback.cwcSequence = function(){



    $( ".cwc_sequence_block" ).draggable({
    	grid: [ 20, 20 ],
    	axis: "x",
    	containment: ".cwc_sequence_block_parent",
		cursor: "move",
    });	

}

var value = 100;

$(document).on("mouseover", "div.cwc_sequence_block_parent", function(){

	var id = $(this).data("db");

	$("#cwc_event_list tr[data-db='"+id+"']").addClass("table-success");


});


$(document).on("mouseout", "div.cwc_sequence_block_parent", function(){

	var id = $(this).data("db");

	$("#cwc_event_list tr[data-db='"+id+"']").removeClass("table-success");


});


$(document).on("mouseover", "#cwc_event_list tr", function(){

	var id = $(this).data("db");

	$("#div.cwc_sequence_block_parent[data-db='"+id+"'] div.cwc_sequence_block").addClass("bg-success");


});


$(document).on("mouseout", "#cwc_event_list tr", function(){

	var id = $(this).data("db");

	$("#div.cwc_sequence_block_parent[data-db='"+id+"'] div.cwc_sequence_block").removeClass("bg-success");


});

poll.cwcSequence = function(){

	if ($("#cwc_sequence_timeline").attr("loading") == undefined) {

		var msg = "hello world";

		$("#cwc_sequence_timeline").attr("loading", "true");

		$.ajax({
			url: "/modules/cwc/sequence/list.php",
			success: function(data){

				var cwcList = JSON.parse(data);


				$("#cwc_sequence_timeline div.cwc_sequence_block_parent[data-db]").each(function(){

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



						if (item.ACTOR_NAME_0 == null) {

							item.ACTOR_NAME_0 = "";

						}

						if (item.ACTOR_NAME_1 == null) {

							item.ACTOR_NAME_1 = "";

						}											

						if (item.ACTOR_NAME_0 + " " + item.ACTOR_NAME_1 != $(this).text().trim()) {

							$(this).find("div.cwc_sequence_block").text(item.ACTOR_NAME_0 + " " + item.ACTOR_NAME_1);

						}


					    // var offset = (item.ORDER - 1) * value;

					    // $( ".cwc_sequence_block_parent[data-db='"+item.INTERACTION_ID+"'] .cwc_sequence_block" ).css("left", offset+"px");


						// if (item.ORDER != $(this).find("td.order").text()) {

						// 	$(this).find("td.order span").text(item.ORDER);

						// }

						// if (item.ACTOR_NAME_0 != $(this).find("span.actor0").text()) {

						// 	$(this).find("span.actor0").text(item.ACTOR_NAME_0);

						// }


						// if (item.ACTOR_NAME_1 != $(this).find("span.actor1").text()) {

						// 	$(this).find("span.actor1").text(item.ACTOR_NAME_1);

						// }


						// if (item.DIRECTION == 2) {

						// 	item.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-arrows-alt-h"></i> <i class="fa fa-walking"></i>';

						// } else if (item.DIRECTION == 0) {

						// 	item.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-chevron-right"></i> <i class="fa fa-walking"></i>';

						// } else if (item.DIRECTION == 1) {

						// 	item.DIRECTION = '<i class="fa fa-user"></i> <i class="fa text-muted fa-chevron-left"></i> <i class="fa fa-walking"></i>';


						// }

						// // console.log(item.DIRECTION);
						// // console.log($(this).find("td.direction").html());


						// if (item.DIRECTION != $(this).find("td.direction").html()) {

						// 	$(this).find("td.direction").html(item.DIRECTION);

						// }

					}

				});


				$.each(cwcList, function(i,o){

					if ($("#cwc_sequence_timeline div.cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"']").length == 0) {

					

						if (o.ACTOR_NAME_0 == null) {

							o.ACTOR_NAME_0 = "";

						}

						if (o.ACTOR_NAME_1 == null) {

							o.ACTOR_NAME_1 = "";

						}					

						$("#cwc_sequence_timeline").append('<div class="progress cwc_sequence_block_parent mb-2" data-db="'+o.INTERACTION_ID+'"><div class="progress-bar cwc_sequence_block" role="progressbar" style="width: '+value+'px">'+o.ACTOR_NAME_0+" "+o.ACTOR_NAME_1+'</div></div>');




					    $( ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"'] .cwc_sequence_block" ).draggable({
					    	grid: [ value/4, 20 ],
					    	axis: "x",
					    	containment: ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"']",
							cursor: "move",
							stop: function( event, ui ) {


								var left = parseFloat($( ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"'] .cwc_sequence_block" ).css("left").replace("px", ""));

								var index = left / value + 1;


								var db = o.INTERACTION_ID;

								$.ajax({
									url: "/modules/cwc/sequence/update.php",
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


					    var offset = (o.ORDER - 1) * value;

					    $( ".cwc_sequence_block_parent[data-db='"+o.INTERACTION_ID+"'] .cwc_sequence_block" ).css("left", offset+"px");

					}

				});

				


				$("#cwc_sequence_timeline").removeAttr("loading");


				var element = $("div[module='cwc/event']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");		






			}
		});

	}

}*/