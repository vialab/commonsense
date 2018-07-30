<!DOCTYPE html>
<html>
	<head>

		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">


		
		<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>		

		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">


		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

		<link rel="stylesheet" href="./css/style.css">
		<script src="./js/script.js"></script>
		<script src="./js/init.js"></script>
		<script src="./js/page.js"></script>
		<script src="./js/column.js"></script>


	</head>
	<body>

		<div class="container my-4">

			<div class="row">

				<div class="col-12">

					<!-- <h1>Annotation Interface Builder <small class="text-muted">(WIP)</small></h1> -->
					<h1 id="layout-title">XAI: Modular Interface Generator</h1>

					<h6 id="layout-author">Chris Kim, Mohamed Amer, Tim Meo, Xiao Lin, Ryan Villamil</h6>


					<? if (!isset($_GET["code"])) { ?>

						<div class="mt-3 mb-3">
							<button class="btn btn-secondary btn-sm" id="create_new"><i class="fa fa-plus"></i> Start New Project</button>
						</div>

					<? } else { ?>

						<?

							$code = $_GET["code"];

						?>

						<script>

							var code = '<?= $code ?>';

						</script>

						<div class="mt-3 mb-3">
							<button class="btn btn-secondary btn-sm" id="add_page"><i class="fa fa-plus"></i> Page</button>
							<!-- <button class="btn btn-success btn-sm" id="save_json"><i class="fa fa-download"></i> Download JSON</button> -->
							<button class="btn btn-primary btn-sm" id="preview"><i class="fa fa-eye"></i> Preview</button>
						</div>

						<form class="row mb-3">
						  <div class="form-group col-6">
						    <label>Title</label>
						    <input type="text" id="title" class="form-control" value="">
						  </div>
						  <div class="form-group col-6">
						    <label>Author</label>
						    <input type="text" id="author" class="form-control" value="">
						  </div>
						</form>


						<div id="pages">




						</div>


						<div class="mt-3 mb-3">

							<h5>JSON Specification</h5>

							<textarea id="output" class="form-control" rows="12" readonly=""></textarea>

						</div>


					<? } ?>

				</div>

			</div>



		</div>

			

		<!-- Modal -->
		<div class="modal fade" id="module-markdown-modal" tabindex="-1" role="dialog" aria-hidden="true">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h5 class="modal-title" id="exampleModalLabel">Markdown Editor</h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
		        
		      	<textarea class="form-control" rows="5" placeholder="" id="module-markdown-text"></textarea>

		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-primary" id="module-markdown-submit">Save changes</button>
		      </div>
		    </div>
		  </div>
		</div>

	</body>

</html>