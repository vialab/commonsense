callback.infoInput = function(){

	var data = JSON.stringify(input, null, "\t");
	$("div[module='info/input'] div.card-body textarea").text(data);

}



$(document).on("click", "#info-input-download", function(){

	var saveData = (function () {
	    var a = document.createElement("a");
	    document.body.appendChild(a);
	    a.style = "display: none";
	    return function (data, fileName) {
	        var json = data,
	            blob = new Blob([json], {type: "octet/stream"}),
	            url = window.URL.createObjectURL(blob);
	        a.href = url;
	        a.download = fileName;
	        a.click();
	        window.URL.revokeObjectURL(url);
	    };
	}());

	var data = $("div[module='info/input'] div.card-body textarea").val(),
	    fileName = "download.json";

	saveData(data, fileName);

});