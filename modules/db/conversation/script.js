callback.cwcConversation = function(){


	var element = $("div[module='db/conversation']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		

}


poll.cwcConversation = function(){

	if ($("#cwc_conversation_list").attr("loading") == undefined) {


		$("#cwc_conversation_list").attr("loading", "true");

		$.ajax({
			url: "/modules/db/conversation/list.php",
			data:{
				session: session_id
			},
			success: function(data){

				var cwcList = JSON.parse(data);

				$("#cwc_conversation_list div[db]").each(function(){

					var id = $(this).attr("db");

					if (cwcList[id] == undefined) {

						$(this).remove();

					} else {


						// if (cwcList[id].ACTOR_NAME != $(this).find("td.name").text()) {

						// 	$(this).find("td.name").text(cwcList[id].ACTOR_NAME);

						// }

					}

				});

				$.each(cwcList, function(i,o){

					if ($("#cwc_conversation_list div[db='"+o.MESSAGE_ID+"']").length == 0) {

						var className = "";
						var direction = "";
						var direction2 = "";

						if (o.DIRECTION == "IN") {
							
							className = "dark";
							direction = "left";
							direction2 = "right";

						} else if (o.DIRECTION == "OUT") {

							className = "primary";
							direction = "right";
							direction2 = "left";

						}

						$("#cwc_conversation_list").prepend('<div db="'+o.MESSAGE_ID+'" class="position-relative"><div class="position-absolute h-100" style="'+direction+':0; "><i class="fa fa-2x fa-caret-'+direction+' text-'+className+'"></i></div><div class="px-3 py-2 mb-2 text-'+direction+' text-white bg-'+className+'" style="border-'+direction+':5px solid #fff">'+o.TEXT+'</div><div>');

					}

				});



				$("#cwc_conversation_list").removeAttr("loading");

				cwcAssetResize();


			}
		});

	}

}

$(document).on("click", "#cwc_conversation_send", function(e){

	e.preventDefault();


	var input = $("#cwc_conversation_input").val();

	if (input.length > 0) {


		$.ajax({
			url: "/modules/db/conversation/add.php",
			type: "POST",
			data: {
				text: input,
				session: session_id				
			},
			success: function(data){


				$("#cwc_conversation_input").val("");
				$("#cwc_conversation_list").scrollTop(0);

			}

		});


	}


});

