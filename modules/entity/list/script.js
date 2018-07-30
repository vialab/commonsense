
var test = $(document).on("click", "#entity-list-group a", function(e){

	// $(this).remove();

});


callback.entityList = function(){

	if (input.entity == undefined) {

		input.entity = {};

	} else {

		$.each(input.entity, function(i,o){

			$("#entity-list-group").append('<div index="'+o.id+'" class="position-relative list-group-item list-group-item-action border-left-0 border-right-0 "><i class="fa fa-times entity-list-remove position-absolute text-danger" style="right: 1.25rem; top: 50%; margin-top: -0.5rem;"></i>'+o.name+'</div>');



			visualBboxInsert(o.id, o.name);



		});


		var element = $("div[module='entity/list']");
		var height = element.find(".content").outerHeight();
		element.css("height", height+"px");			


		if (input.bbox != undefined) {

			$.each(input.bbox, function(i,o){

				var item = o;
				var list = o.list;

				var bar = $("div.visual-bbox-bar[index='"+o.id+"']").find("svg")[0];

				$.each(list, function(j,p){

					console.log(p);

					var position = p.percentage / 100 * $("div.visual-bbox-bar[index='"+o.id+"']").find("svg").width();

					var path = visualBboxInsertMakeSvg('circle', {cx: position, cy: 5, r: 2, fill: "black", percentage: p.percentage, x: p.x, y: p.y, w: p.w, h: p.h});
					bar.appendChild(path);




				});

			});

		}


	}

};

$(document).on("click", "i.entity-list-remove", function(){

	var index = $(this).closest("#entity-list-group div.list-group-item").attr("index");

	 $("#entity-list-group div.list-group-item[index='"+index+"']").remove();
	 $("#visual-bbox-timeline div.visual-bbox-bar[index='"+index+"']").remove();

	delete input.entity[index];

	if ($("#visual-bbox-timeline div.visual-bbox-bar").length == 0) {

		$("#visual-bbox-alert").show();

	}


	save();

	var element = $("div[module='entity/list']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");			

	visualBboxDelete(index);	

	visualBboxSave();

});


$(document).on("click", "#entity-list-add", function(){

	var text = $("#entity-list-input").val();

	if (text == "") {

		return false;

	}


	var index = moment().unix();

	var entity = {};

	entity.id = index;
	entity.name = text;


	input.entity[index] = entity;


	$("#entity-list-input").val("");

	$("#entity-list-group").append('<div index="'+index+'" class="position-relative list-group-item list-group-item-action border-left-0 border-right-0 "><i class="fa fa-times entity-list-remove position-absolute text-danger" style="right: 1.25rem; top: 50%; margin-top: -0.5rem;"></i>'+text+'</div>');


	var element = $("div[module='entity/list']");
	var height = element.find(".content").outerHeight();
	element.css("height", height+"px");

	visualBboxInsert(index, text);

	// if (typeof relationalSummaryInsert === "function") {

	// 	relationalSummaryInsert(text, "visual");

	// }


	save();
	visualBboxSave();

});
