callback.infoText = function(){

	var filename = $("div[module='info/text']").attr("meta");
	
	$.ajax({
		url: "/generate/process/download.php",
		type: "GET",
		data: {
			code: filename
		},
		success: function(data){

			var html = md.render(data);

			$("div[module='info/text'] .card-body").html(html);

			var element = $("div[module='info/text']");
			var height = element.find(".content").outerHeight();
			element.css("height", height+"px");	

		}

	});	

}