function annotateLogInsert(text, data){

	$("#annotate_log_list").prepend("<div class='alert alert-info p-2 mb-1 '>\
		<div class='row mb-1'>\
			<div class='col-8'>\
				<h6 class='mb-0'><small class='d-block font-weight-bold'>"+text+"</small></h6>\
			</div>\
			<div class='col-4 text-right'>\
				<h6 class='mb-0'><small class='d-block font-weight-bold'>"+moment().format("hh:mm:ss")+"</small></h6>\
			</div>\
		</div>\
		<small class='d-block' style='word-break: break-all;'>"+JSON.stringify(data)+"</small>\
	</div>");

}