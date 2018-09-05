callback.dbSelect = function(){


	var element = $("div[module='db/select']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");		

	var meta = $("div[module='db/select']").attr("meta");



	$.ajax({
		url: "/modules/db/select/load.php",
		data: {
			meta: meta
		},
		success: function(data){

			var list = JSON.parse(data);
			var sessionSuffix = session_id.split("UPLOAD")[1];

			$.each(list, function(i,o){

				var sessionTemp = o.replace("LAYOUT", "UPLOAD")+sessionSuffix;

				$("#db_select_dropdown").append("<option value='"+o+"'>"+o+" ("+sessionTemp+")</option>");

			});

			$("#db_select_dropdown").val(code);

		}

	})	

}


$(document).on("change", "#db_select_dropdown", function(){

	var sessionSuffix = $("#header-session strong").text().split("UPLOAD");

	window.location.href = "/view/?code="+$(this).val()+"&session="+($(this).val().replace("LAYOUT", "UPLOAD")+sessionSuffix[1]);

});