
$(document).on("click", ".add_column", function(){

	// if ($("div.column").length >= 6) {

	// 	return false;

	// }

	var columns = $(this).closest("div.page").find(".columns");

	$.ajax({
		url: "./module/column.html",
		success: function(data){

			var content = data;
			columns.append(data);


			$( ".module-list" ).sortable({
		      connectWith: ".module-list",
            	placeholder: "ui-state-highlight",		      
		      update: function(){

					generateJson();

		      }
		    }).disableSelection();	


			generateJson();

		}
	})

});
