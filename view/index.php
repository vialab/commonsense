<?


	if (isset($_GET["session"]) && isset($_GET["code"])) {

		$session_id = $_GET["session"];



	} else {

		session_start();
		$session_id = session_id().md5($_GET["code"]);

	}

?>
<!DOCTYPE html>
<html>
	<head>

		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">

		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css">


		
		<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>		

		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js"></script>

		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/remarkable/1.7.1/remarkable.min.js"></script>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.min.js"></script>

		<script>

			var session_id = '<?= $session_id; ?>';

		</script>

		<link rel="stylesheet" href="./css/style.css">
		<script src="./js/script.js"></script>


	</head>
	<body>


		<? if (!isset($_GET["code"])) { ?>

			<div class="container my-4" id="canvas">

				<div class='alert alert-danger text-center'>Not available</div>

			</div>

		<? } else { ?>

			<?

				$code = $_GET["code"];
				$page = 1;

				if (isset($_GET["page"])) { 

					$page = $_GET["page"];

				}

			?>


			<script>

				var code = '<?= $code ?>';
				var page = <?= $page ?>;

			</script>

			
			<?

				include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


				$conn = init_sql();
				$code = $_GET["code"];

				$query = "SELECT * FROM LAYOUTS WHERE CODE = '$code' LIMIT 1";

				$result = $conn->query($query);

			    while ($row = $result->fetch_object()){
			        $output = $row;
			    }


		    	$data = json_decode($output->JSON);


		    ?>

			<div class="container my-4" id="canvas">

				<div class="row">

					<div class="col-6">

						<h1 id="header-title" class=''><?= $data->title ?></h1>

					</div>
					<div class="col-6 text-right">

						<small class="text-muted m-0" style="line-height: 1;" id="last_saved">Last saved: <span></span></small>

					</div>

				</div>
				<h6 class='' id="header-author"><?= $data->author ?></h6>
				

					<? if (!isset($_GET["session"])) { ?>

						<small class="d-block mt-1" id="header-session"><span>Session: <strong><?= $session_id ?></strong></span>
						<a id="header_startnew" href="#" class="text-danger">(Start New Session)</a>

					<? } else { ?>

						<small class="d-block mt-1" id="header-session"><span>Viewing Session: <?= $session_id ?></span>
						<span class="text-muted">(Read only mode)</span>

					<? } ?>


				</small>
				<small class="d-block mt-0" id="header-session"><span>Permalink:</span> <a target="_blank" href="http://commonsense.ckprototype.com/view/?code=<?= $code ?>&session=<?= $session_id ?>&page=<?= $page ?>">Go</a></small>

				<div class='row mt-3'>
					<div class='col-6 text-left' id='nav'>
						
						<? foreach ($data->layout as $i => $item) { ?>

							<?

								$i += 1;



								if (isset($_GET["session"])) {

									$path = "./?code=".$code."&session=".$session_id."&page=".$i;

								} else {

									$path = "./?code=".$code."&page=".$i;
								}



							?>

							<a href='<?= $path ?>' class='nav-page btn btn-sm mr-1 <? if ($page == $i) { echo "btn-primary"; } else { echo "btn-secondary"; } ?>' page='<?= $i ?>'><?= $item->title ?></a>

						<? } ?>



					</div>
					<div class='col-6 text-right'>


					</div>
				</div>				
<!-- 
// 	$("#canvas").append("<div class='row'><div class='col-11'><div class='row mt-4' id='layout'></div></div><div class='col-1 mt-4' id='page'></div></div>");

// 	$.each(data.layout[page-1].columns, function(i,o){

// 		var className = "col-"+o.size;
// 		var id = "column_"+i;

// 		$("#layout").append("<div class='"+className+"' id='"+id+"'></div>");

// 		$.each(o.modules, function(j,p){

// 			$("#"+id).append("<div class='placeholder module mb-4' module='"+p.name+"' meta='"+p.meta+"'>"+p.name+"</div>");

// 		});

// 	}); -->


					<div class='row'>
						<div class='col-11'>
							<div class='row mt-4' id='layout'>
								
								<? foreach ($data->layout[$page-1]->columns as $i => $item) { ?>

									<?


									?>

									<div class='col-<?= $item->size ?>' id='column_<?= $i ?>'>
										
										<? foreach ($item->modules as $module) { ?>

											<div class='placeholder module mb-4' module='<?= $module->name ?>' meta='<?= $module->meta ?>'>
													
												<?= $module->name ?>
												<?= $module->meta ?>


											</div>

										<? } ?>


									</div>

								<? } ?>


							</div>
						</div>
						<div class='col-1 mt-4' id='page'>

<!-- 
// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');

// 	} else if (page == spec.layout.length) {

// 		$("#page").append('<button disabled class="btn btn-block btn-secondary text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');


// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');

// 		$("#page").append('<button class="btn btn-block btn-primary text-center page_nav" direction="new"><i class="fa fa-sync-alt fa-block"></i><br><span style="line-height:1; display:block">Start<br>New</span></button>');

// 	} else {


// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>');

// 		$("#page").append('<button class="btn btn-block btn-success text-center page_nav" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>');
							 -->

							 <? if ($page == (count($data->layout))) { ?>

								<a class="btn btn-block btn-light text-center" disabled href="#" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</a>

							<? } else { ?>

								<button class="btn btn-block btn-success text-center page_nav" href="#" direction="next"><i class="fa fa-arrow-right fa-block"></i><br>Next</button>


							<? } ?>


							 <? if ($page == 1) { ?>

								<a class="btn btn-block btn-light text-center" disabled href="#" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</a>

							<? } else { ?>

								<button class="btn btn-block btn-success text-center page_nav" href="#" direction="prev"><i class="fa fa-arrow-left fa-block"></i><br>Prev</button>


							<? } ?>



						</div>
					</div>

			</div>

		<? } ?>

	</body>

</html>