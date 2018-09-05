callback.infoText = function(){

	var filename = $("div[module='info/text']").attr("meta");
	
	$.ajax({
		url: "/generate/process/download.php",
		type: "GET",
		data: {
			code: filename
		},
		success: function(data){


			if (code == "STUDY001") {

				var html = md.render(data);

				$("div[module='info/text'] .card-body").html(html);

				var element = $("div[module='info/text']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");	


			} else {

				var html = md.render(data);

				$("div[module='info/text'] .card-body").html(html);

				var element = $("div[module='info/text']");
				var height = element.find(".content").outerHeight();
				element.css("height", height+"px");	

				$("div[module='info/text'] .card-body p").each(function(){

					var paragraph = $(this);

					var text = $.trim($(this).text());
					var textArray = text.split(" ");

					paragraph.empty();

					$.each(textArray, function(i,o){

						paragraph.append("<span>"+o+"</span> ");

					});

				});

			}



		}

	});	

}

$(document).on("click", "div[module='info/text'] p span", function(){

	$(this).toggleClass("active");

	var textArray = [];

	$("div[module='info/text'] span.active").each(function(i,o){

		textArray.push($(this).text());

	});

	if (textArray.length > 0) {

		var textString = textArray.join(" ");
		$("#cwc_asset_add span").text(': "'+textString+'"');
		$("#cwc_asset_add").attr("text", textString);

	} else {

		$("#cwc_asset_add span").empty();
		$("#cwc_asset_add").removeAttr("text");

	}



});




$(document).on("click", "#cwc_asset_add", function(e){

	e.preventDefault();

	var name = $("#cwc_asset_add").attr("text");
	var id = $(this).attr("db");
	var meta = $("div[module='db/asset']").attr("meta");
	var name2 = $("#cwc_asset_add").attr("text");


	if (id != "" && name != undefined && name != "") {

		$.ajax({
			url: "/modules/db/asset/add.php",
			type: "POST",
			data: {
				id: id,
				name: name,
				name2: name2,
				session: session_id,
				meta: meta
			},		
			success: function(data){

				$.each(poll, function(i,o){

					o();

				});
				
				$("div[module='info/text'] span.active").removeClass("active");
				$("#cwc_asset_add span").empty();
				$("#cwc_asset_add").removeAttr("text");			

			}
		});

	}


});