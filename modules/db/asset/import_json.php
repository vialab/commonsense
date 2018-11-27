<?


	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();


	$scene = $_POST["scene"];

	$json = file_get_contents($_SERVER["DOCUMENT_ROOT"]."/assets/json/scene-".$scene.".conglomerate-tracked-utface.json");
	$array = json_decode($json);

	if ($_POST["mode"] == "characters") {



		$characters = array();

		foreach ($array as $item) {

			if (isset($item->utface_output) && isset($item->utface_output->faces)) {

				foreach ($item->utface_output->faces as $face) {

					$characters[$face->character_name] = true;

				}

			}


		}


		$id = 18389;
		$session = $_POST["session"];
		$tag = null;

		foreach ($characters as $name => $value) {


	        $rand = rand(20, 80);
	        $rand2 = rand(20, 80);
	        $rand3 = rand(20, 80);
	        $rand4= rand(20, 80);

			$name2 = $name;

	        $meta = "MAIN";
	        $extid = uniqid();
	        $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID, TAG) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?, ?, ?)");
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();

	        $tag = NULL;

	        $meta = "BODY";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();

	        $meta = "POSE";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();

	        $meta = "FIGURE";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();

	        $meta = "FACE";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();


		}



	} else if ($_POST["mode"] == "visual") {


		$faces = array();
		$bodies = array();
		$pose = array();
		$mit = array();






		$width_alt = 480 * 2;
		$height_alt = 203.984 * 2;

		$width_alt2 = 480;
		$height_alt2 = 203.984;

		foreach ($array as $index=>$item) {


			if (count($item->tracked_people) > 0) {


				foreach ($item->tracked_people as $person) {

					$face = $person->utface_data;

					$face->frame += 1;

					$face->w = $face->w / $width_alt * 100;
					$face->h = $face->h / $height_alt * 100;
					$face->x = $face->x / $width_alt * 100;
					$face->y = $face->y / $height_alt*  100;

					$faces[$face->character_name][$face->frame] = $face;


					if (isset($person->darknet_data->Bbox)) {


						$body = new stdClass();

						$body->w = $person->darknet_data->Bbox[2] / $width_alt2 * 100;
						$body->h = $person->darknet_data->Bbox[3] / $height_alt2 * 100;
						$body->x = $person->darknet_data->Bbox[0] / $width_alt2 * 100;
						$body->y = $person->darknet_data->Bbox[1] / $height_alt2 *  100;
						$body->frame = $face->frame;

						$bodies[$face->character_name][$face->frame] = $body;



					}

					if (count($person->openpose_data) == 54) {


						$openpose = array_chunk($person->openpose_data, 3);


						foreach ($openpose as $dot) {

							$poseItem = new stdClass();
							$poseItem->x = $dot[0] / $width_alt2 * 100;
							$poseItem->y = $dot[1] / $height_alt2 * 100;
							$poseItem->frame = $face->frame;

							$pose[$face->character_name][$face->frame][] = $poseItem;

						}


					}


				}



			} else {



			};

			$temp = json_encode($item);

			if (strpos($temp, "mit") !== false) {

				foreach ($item->mit_objects as $object) {

					foreach ($object->polygon as $dots) {

						$dots->frame = ($item->_idx+1);
						$dots->x = $dots->x / $width_alt2 * 100;
						$dots->y = $dots->y / $height_alt2 * 100;

						$mit[$object->object_name."-".$object->object_idx][($item->_idx+1)][] = $dots;


					}

				}



			}



		}




		$frame = (int)$_POST["frame"]-1;
		$characters = array();

		$data = $array[$frame];

		$meta = $_POST["meta"];

		$actor = $_POST["db"];

    	$time = $_POST["frame"];
    	$name = $_POST["name"];

    	if ($meta == "FACE") {

    		if (isset($faces[$name]) && isset($faces[$name][$frame])) {

			    $item = $faces[$name][$frame];

			    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
			    $stmt->execute();

			    $db_id = $stmt->insert_id;


		    	$x0 = $item->x;
		    	$x1 = $item->x + $item->w;
		    	$y0 = $item->y;
		    	$y1 = $item->y + $item->h;

			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");


    		} else {
    			
    			echo "FAIL";

    		}


    	} else if ($meta == "BODY") {

    		if (isset($bodies[$name]) && isset($bodies[$name][$frame])) {

			    $item = $bodies[$name][$frame];

			    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
			    $stmt->execute();

			    $db_id = $stmt->insert_id;

		    	$x0 = $item->x;
		    	$x1 = $item->x + $item->w;
		    	$y0 = $item->y;
		    	$y1 = $item->y + $item->h;

			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");


    		} else {
    			
    			echo "FAIL";

    		}

    	} else if ($meta == "POSE") {

    		if (isset($pose[$name]) && isset($pose[$name][$frame])) {

			    $item = $pose[$name][$frame];

			    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
			    $stmt->execute();

			    $db_id = $stmt->insert_id;


		    	foreach ($item as $dot) {


			    	$time = $dot->frame;


			    	$x0 = $dot->x;
			    	$y0 = $dot->y;		    	


			    	if ($x0 <= 5 && $y0 <= 5) {

					    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y, HIDE) VALUES ($db_id, $x0, $y0, 1)");

		    		} else {


					    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");


			    	}




		    	}





    		} else {
    			
    			echo "FAIL";

    		}


    	} else {

    			echo "FAIL";


    	}



		// foreach ($array as $item) {

		// 	if (isset($item->utface_output) && isset($item->utface_output->faces)) {

		// 		foreach ($item->utface_output->faces as $face) {

		// 			$characters[$face->character_name] = true;

		// 		}

		// 	}


		// }

		// var_dump($_POST);

	}


	$conn->close();

?>