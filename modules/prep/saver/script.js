
$(document).on("click", ".prep_saver_export", function(){

	var mode = $(this).attr("mode");

	var href = "/modules/prep/saver/save.php?mode="+mode+"&session="+session+"&code="+code;

	window.location.href = href;


});