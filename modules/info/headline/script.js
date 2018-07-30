callback.infoHeadline = function(){


	var filename = $("div[module='info/headline']").attr("meta");
	
	$.ajax({
		url: "/generate/process/download.php",
		type: "GET",
		data: {
			code: filename
		},
		success: function(data){


			var html = md.render(data);

			$("div[module='info/headline'] .jumbotron").html(html);

			var element = $("div[module='info/headline']");
			var height = element.find(".content").outerHeight();
			element.css("height", height+"px");			




			$("div[module='info/embed']").parent().css("height", height+"px");
			$("div[module='info/embed']").css("height", height+"px");

		}

	});	

}