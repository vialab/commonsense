callback.relationalVisual = function(){

	relationalVisualPopulate();

}

trigger.relationalVisual = function(){

	relationalVisualPopulate();

}


function relationalVisualPopulate(){

	$("#relational-visual-table").empty();

	$.each(input.entity, function(i,o){

		$("#relational-visual-table").append('<tr index="'+o.id+'"><th scope="row" class="text-center"><input class="form-control form-control-sm relational-visual-entity relational-visual-edit" name="entity" type="number" value="'+o.entity+'"></th><td><input class="form-control form-control-sm relational-visual-edit relational-visual-name" name="name"  value="'+o.name+'"></td><td class="text-center"><input class="form-control form-control-sm relational-visual-edit  relational-visual-start" name="start" type="number" min="0" max="100" value="'+o.start+'"></td><td class="text-center"><input class="form-control form-control-sm relational-visual-end relational-visual-edit" name="end" type="number" min="0" max="100" value="'+o.end+'"></td><td>'+'<button class="btn btn-danger btn-sm relational-visual-remove"><i class="fa fa-times"></i></button>'+'</td></tr>');

	});

	$("#relational-visual-list-box").scrollTop(1000000);

}

$(document).on("input", ".relational-visual-name, relational-visual-edit", function(){

	$(this).removeClass("animated rubberBand");

});

$(document).on("change", ".relational-visual-name, .relational-visual-edit", function(){

	$(this).addClass("animated rubberBand");

	var id = $(this).closest("tr").attr("index");
	var name = $(this).attr("name");

	input.entity[id][name] = $(this).val();

	save();

});

$(document).on("click", ".relational-visual-remove", function(){

	var id = $(this).closest("tr").attr("index");
	delete input.entity[id];

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


$(document).on("click", ".relational-visual-cancel", function(){

	$("#visual-overlay-entity").val("");
	$("#visual-overlay-start").val("");
	$("#visual-overlay-end").val("");

	$("#relational-visual-table tr.table-danger").remove();

	visualOverlay();


});