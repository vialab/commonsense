
$(document).on("click", "#add_page", function(){



	$.ajax({
		url: "./module/page.html",
		success: function(data){

			var content = data;
			$("#pages").append(data);

			generateJson();


		}
	})

});



$(document).on("click", "button.page-remove", function(){

	var column = $(this).closest("div.page");
	column.remove();

	generateJson();

});


$(document).on("click", "button.page-move-up", function(){

	var column = $(this).closest("div.page");
	var left = column.prev("div.page");

	left.before(column);

	generateJson();

});



$(document).on("click", "button.page-move-down", function(){

	var column = $(this).closest("div.page");
	var right = column.next("div.page");

	right.after(column);

	generateJson();

});




$(document).on("input", "input.page-title", function(){


	generateJson();

});

