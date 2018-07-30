callback.relationalTextual = function(){



	relationalTextualPopulate();

}

trigger.relationalVisual = function(){

	relationalTextualPopulate();

}


function relationalTextualPopulate(){

	$("#relational-textual-table").empty();

	$.each(input.token, function(i,o){

		$("#relational-textual-table").append('<tr index="'+o.id+'"><td><input class="form-control form-control-sm relational-textual-name" value="'+o.name+'"></td><td class="text-left">'+o.text+'</td><td>'+o.type+'</td><td>'+'<button class="btn btn-danger btn-sm relational-textual-remove"><i class="fa fa-times"></i></button>'+'</td></tr>');

	});

	$("#relational-textual-list-box").scrollTop(1000000);

}

$(document).on("click", ".relational-textual-remove", function(){

	var id = $(this).closest("tr").attr("index");
	delete input.token[id];


	$.each(input.connection, function(i,o){

		if (i.indexOf(id) > -1) {

			delete input.connection[i];

		}

	});


	if (input.position != undefined && input.position[id] != undefined) {

		delete input.position[id];

	}



	$(this).closest("tr").remove();
	save();

});

$(document).on("input", ".relational-textual-name", function(){

	$(this).removeClass("animated rubberBand");

});

$(document).on("change", ".relational-textual-name", function(){

	$(this).addClass("animated rubberBand");

	var id = $(this).closest("tr").attr("index");
	input.token[id].name = $(this).val();

	save();

});