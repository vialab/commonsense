
var md = new Remarkable({
  html:         false,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      false,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed
  highlight: function (/*str, lang*/) { return ''; }
});


var callback = {};
var animate = {};
var trigger = {};
var poll = {};

var session = "";

var spec = null;
var hash = null;
var input = {};

$(document).ready(function(){

	$.ajaxSetup({
		cache: false
	});

	start();

});


function start(){


	if ($("#nav a").length == 1) {

		$("#page").remove();
		$("#page").prev("div").attr("click", "col-12");
		$("#nav").parent("div").remove();

	} else {

		// $("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');
		// $("#page").append('<button disabled class="btn btn-block btn-secondary text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');

	}


	fetch();

	return false;

	load();

}

function hashswitch(){

	// alert("Hello");

	var text = window.location.hash.replace("#", "");
	var array = text.split("/");

	if (hash == array[0]) {

		if (page == array[1]) {


		} else {

			page = array[1];
			generate();

		}

	} else {

		window.location.reload();

	}


}

function load() {



	$.ajax({
		url: "/generate/process/load.php",
		data:{
			code: code
		},
		success: function(data){

			data = JSON.parse(data);
			spec = data;

			build();

		}

	});


	$.ajax({
		url: "http://xai-data.ckprototype.com/specs/"+search,
		success:function(data){

			data = JSON.parse(data);
			spec = data;

			$.ajax({
				url: "./process/load_input.php",
				data: {
					file: search
				},
				type: "POST",				
				success:function(data){

					if (data == "") {

						input = {};

					} else {

						data = JSON.parse(data);
						input = data;

					}

					build();

				}

			});

		}
	})

}


function build() {

	var data = spec;

	$.ajax({
		url: "./module/layout.html",
		success: function(html){

			$("#canvas").html(html);

			if (data.title != "") {

				$("#canvas h1#header-title").text(data.title);

			}


			if (data.author != "") {

				$("#canvas h6#header-author").text(data.author);

			}

			$("#canvas #header-session span").html("Permalink: <a href='http://"+window.location.hostname+"/?session="+session_id+"#"+hash+"' target='_blank'>Go</a>");
			// $("#canvas #header-session span").html("Permalink: <a href='http://"+window.location.hostname+"/?session="+session_id+"#"+hash+"' target='_blank'>"+"http://"+window.location.hostname+"/?session="+session_id+"#"+hash+"</a>");


			$("#header-url").attr("href", "http://"+window.location.pathname.replace("-view", "-generate")+"#"+hash);




			for (var i = 0; i <= data.layout.length-1; i++) {


				$("#nav").append("<a href='#"+hash+"/"+(i+1)+"' class='nav-page btn btn-secondary btn-sm mr-1' page='"+(i+1)+"'>"+(i+1)+". "+data.layout[i].title+"</a>");

			}


			generate();

		}
	})



}

function generate(){

	var data = spec;

	$("#nav a.nav-page[page='"+page+"']").addClass("btn-primary").removeClass("btn-secondary");
	$("#nav a.nav-page[page='"+page+"']").siblings().removeClass("btn-primary").addClass("btn-secondary");

	$("#layout").parent().closest("div.row").remove();

	$("#canvas").append("<div class='row'><div class='col-11'><div class='row mt-4' id='layout'></div></div><div class='col-1 mt-4' id='page'></div></div>");

	if (page == undefined) {

		page = 1;

	}

	if (data.layout[page-1] != undefined) {


		$.each(data.layout[page-1].columns, function(i,o){

			var className = "col-"+o.size;
			var id = "column_"+i;

			$("#layout").append("<div class='"+className+"' id='"+id+"'></div>");

			$.each(o.modules, function(j,p){

				$("#"+id).append("<div class='placeholder module mb-4' module='"+p.name+"' meta='"+p.meta+"'>"+p.name+"</div>");

			});

		});

		if (page == 1) {

			if (spec.layout.length == 1) {

				$("#page").remove();
				$("#page").prev("div").attr("click", "col-12");
				$("#nav").parent("div").remove();

			} else {

				$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');
				$("#page").append('<button disabled class="btn btn-block btn-secondary text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');

			}


		} else if (page == spec.layout.length) {

			$("#page").append('<button disabled class="btn btn-block btn-secondary text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');
			$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');

		} else {

			$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');

			$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');

		}


		$("#page").append('<button class="btn btn-block btn-sm btn-primary text-center page_nav" direction="refresh"><i class="fa fa-sync-alt fa-block"></i><br>Reload</button>');


		$("#nav a.nav-page").prop("disabled", true);

		resetEvents();
		fetch();

	} else {

		alert("Error occurred. Going back to the first page.");
		var destination = hash+"/1";
		window.location.hash = destination;		

	}

}



$(document).on("click", "button.page_nav[direction]", function(){

	var direction = $(this).attr("direction");

	if (direction == "prev") {

		// alert("Hello");
		// $("#nav a.nav-page.btn-primary").prev().click();
		var newPage = parseInt(page) - 1 - 1;
		// var destination = hash+"/"+newPage;
		// window.location.hash = destination;


		var path = $("#nav a:eq("+newPage+")").attr("href");
		window.location.href = path;


	} else if (direction == "next") {

		// $("#nav a.nav-page.btn-primary").next().click();

		var newPage = parseInt(page) + 1 - 1;

		var path = $("#nav a:eq("+newPage+")").attr("href");
		window.location.href = path;

		// var destination = hash+"/"+newPage;
		// window.location.hash = destination;

	} else if (direction == "refresh") {

		window.location.reload();

	} else if (direction == "new") {

		var index = Math.floor(Math.random() * 30);
		var letter = "O";

		if (Math.random() > 0.5) {

			letter = "X";

		} 

		var destination = index+"_"+letter;

		alert(destination);

	    var passhash = CryptoJS.MD5(destination);


		window.location.hash = passhash;
		window.location.reload();

	}

});

function resetEvents(){

	var events = $._data(document, 'events');
	console.log(events);

	$.each(events, function(i,o){

		$.each(o, function(j,p){

			if (p != undefined) {


				if (p.type != undefined && (p.type == "click" || p.type == "dblclick") && p.namespace == "") {


					if (p.selector == "#nav a.nav-page" || p.selector == "#header_startnew" || p.selector == "#clear_input" || p.selector == "button.page_nav[direction]") {


					} else {

						console.log(p.selector);
						$(document).off(p.type, p.selector);

					}


				}

			}



		});


	});


	var events = $._data(document, 'events');
	console.log(events);


}

// $(document).on("click", "#nav a.nav-page", function(e){

// 	e.preventDefault();

// 	page = $(this).attr("page");

// 	window.location.hash = hash + "/" + page;

// 	var data = spec;

// 	$(this).addClass("btn-primary");
// 	$(this).removeClass("btn-secondary");

// 	$(this).siblings().removeClass("btn-primary").addClass("btn-secondary");

// 	$("#layout").remove();
// 	$("#page").remove();



// 	$("#canvas").append("<div class='row'><div class='col-11'><div class='row mt-4' id='layout'></div></div><div class='col-1 mt-4' id='page'></div></div>");

// 	$.each(data.layout[page-1].columns, function(i,o){

// 		var className = "col-"+o.size;
// 		var id = "column_"+i;

// 		$("#layout").append("<div class='"+className+"' id='"+id+"'></div>");

// 		$.each(o.modules, function(j,p){

// 			$("#"+id).append("<div class='placeholder module mb-4' module='"+p.name+"' meta='"+p.meta+"'>"+p.name+"</div>");

// 		});

// 	});

// 	if (page == 1) {

// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');

// 	} else if (page == spec.layout.length) {

// 		$("#page").append('<button disabled class="btn btn-block btn-secondary text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');


// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');

// 		$("#page").append('<button class="btn btn-block btn-primary text-center page_nav" direction="new"><i class="fa fa-sync-alt fa-block"></i><br><span style="line-height:1; display:block">Start<br>New</span></button>');

// 	} else {


// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');

// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');

// 	}


// 	$("#nav a.nav-page").prop("disabled", true);

// 	resetEvents();
// 	fetch();

// });

function fetch() {

	callback = {};
	animate = {};
	trigger = {};
	poll = {};

	var data = spec;

	var total = $(".module").length;
	var count = 0;


	if (total == 0) {

		$("#layout").html('<div class="col-6 offset-3"><div class="alert alert-danger text-center">No modules available</div></div>');

	} else {

		// resetEvents();
		fetchModule();

	}



};


function fetchModule(){

	if ($(".module").length == $(".module.complete").length) {

		console.log(callback);
		console.log(poll);

		var index = 0;

		$.each(callback, function(i,o){

			o();

		});


		$.each(poll, function(i,o){

			setInterval(function(){

				o();

			}, 1000);

		});


		$("#nav a.nav-page").prop("disabled", false);


	} else {

		$(".module:not(.complete):first").each(function(){


			var element = $(this);
			var moduleName = element.attr("module");

			var hostname = "/modules/";


			$("head").append("<link rel='stylesheet' href='"+hostname+"/"+moduleName+"/style.css?v="+Math.random()+"'>");

			$.ajax({
				url: hostname+"/"+moduleName+"/script.js",
				dataType: "script",
				success: function(data){

					$.ajax({
						url: hostname+"/"+moduleName+"/layout.html",
						success: function(data){


							element.html("<div class='content'>"+data+"</div>");

							var height = element.find(".content").outerHeight();

							element.css("height", height+"px");
							element.removeClass("placeholder");
							element.addClass("complete");

							console.log(moduleName);

							fetchModule();


						}
					});	
					
				}
			});		
		

		});



	}



}

function save(){

	var json = JSON.stringify(input);


	$.ajax({
		url: "./process/save_input.php",
		data: {
			file: hash,
			data: json
		},
		type: "POST",
		success:function(data){

			$("#last_saved span").text(moment().format("MMMM Do YYYY, h:mm:ss a"));
			$("#last_saved").show(); //;.delay(3000).slideUp();

		}

	});	

}



$(document).on("click", "#clear_input", function(e){

	e.preventDefault();

	input = {};
	save();

	window.location.reload();

});





$(document).on("click", "#header_startnew", function(e){

	e.preventDefault();

	var response = confirm("Are you sure? Your current session will be archived.");

	if (response == true) {

		$.ajax({
			url: "./process/clear.php",
			type: "POST",
			success:function(data){

				window.location.href = "/view/?code="+code;

				// window.location.reload();

			}

		});	

	}

	

});
