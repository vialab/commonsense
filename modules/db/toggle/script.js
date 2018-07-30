var cwcMGdata = null;

callback.cwcToggle = function(){

	 
	var path = "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='cwc/toggle']").attr("meta");

	$.ajax({
		url: path,
		filetype: "text",
		success: function(data){

			data = JSON.parse(data);

			cwcMGdata = data;

		}

	});

	var element = $("div[module='cwc/toggle']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		


}




$(document).on("click", "#cwc_toggle_upload", function(e){

	e.preventDefault();


	$.ajax({
		url: "/modules/cwc/toggle/upload.php",
		data: {
			url: "http://xai-data.ckprototype.com/media/"+hash+"/"+$("div[module='cwc/toggle']").attr("meta")
		},
		type: "POST",
		success: function(data){


		}
	});


});