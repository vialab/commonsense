callback.infoEmbed = function(){

	var path = $("div[module='info/embed']").attr("meta");

	var html = '<iframe class="border-0 w-100 d-block" allowfullscreen src="'+path+'" height="480"></iframe>';

	$("div[module='info/embed']").html(html);


	var element = $("div[module='info/embed']");
	var height = element.find("iframe").outerHeight();
	element.css("height", height+"px");		



}