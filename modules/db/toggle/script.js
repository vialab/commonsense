var cwcMGdata = null;

callback.cwcToggle = function(){

	 
	var path = "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='db/toggle']").attr("meta");

	$.ajax({
		url: path,
		filetype: "text",
		success: function(data){

			data = JSON.parse(data);

			cwcMGdata = data;

		}

	});

	var element = $("div[module='db/toggle']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		


}




$(document).on("click", "#cwc_toggle_upload", function(e){

	e.preventDefault();


	$.ajax({
		url: "/modules/db/toggle/upload.php",
		data: {
			url: "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='db/toggle']").attr("meta")
		},
		type: "POST",
		success: function(data){


		}
	});


});