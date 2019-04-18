<?

	$mode = $_GET["mode"];
	$session = $_GET["session"];
	$code = $_GET["code"];


	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$query = "SELECT * FROM LAYOUTS WHERE CODE = '$code' LIMIT 1";

	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $layout = $row;
    }



	$data = json_decode($layout->JSON);	

	$meta = $data->layout[0]->columns[0]->modules[0]->meta;
	$length = explode(":", $meta)[1];


	if ($mode == "3d") {


		$query = "SELECT FRAMES.*, ACTORS.EXT_ID FROM FRAMES INNER JOIN ACTORS ON ACTORS.ACTOR_ID = FRAMES.ACTOR_ID WHERE `SESSION` = '$code'";

		$result = $conn->query($query);

		$data = array();

	    while ($row = $result->fetch_object()){

	    	$data[$row->FRAME_NUM][] = $row;

	    }


		$output = array();
		$output["cameras"] = array();
		$output["people"] = array();
		$output["static_points"] = array();

		for ($i = 1; $i <= $length; $i++) {

			if (isset($data[$i])) {

				foreach ($data[$i] as $row) {

					if ($row->EXT_ID == "CAMERA") {

						$output["cameras"][] = array($row->X, $row->Y, $row->RZ);

					} else {

						$output["people"][] = array($row->X, $row->Y);

					}

				}

			} else {

				$output["cameras"][] = array();
				$output["people"][] = array();


			}

			// $output["static_points"][] = array(0, 1, 2);

		}

		// var_dump($output);

		// die();

	} else {

		$output = array();

		// $meta = json_decode($layout->META, true);

		// $bbox = $meta["bbox"];


		$bbox = array();

		for ($i = 0; $i < $length; $i++) {

			$bbox["FRAME".$i] = array();
			$bbox["FRAME".$i]["bounding_box_ids"] = array();
			$bbox["FRAME".$i]["bounding_boxes"] = array();
			$bbox["FRAME".$i]["shot"] = "shot_".$i;


		}

		$frame = 0;


		$query = "SELECT EXT_ID, TIME, OVERLAY_POINTS.X, OVERLAY_POINTS.Y FROM OVERLAY_POINTS INNER JOIN OVERLAYS ON OVERLAYS.OVERLAY_ID = OVERLAY_POINTS.OVERLAY_ID INNER JOIN ACTORS ON ACTORS.ACTOR_ID = OVERLAYS.ACTOR_ID WHERE `SESSION` = '$code' AND META = 'MAIN'";

		$result = $conn->query($query);

		$points = array();

	    while ($row = $result->fetch_object()){

	        $points[$row->TIME][$row->EXT_ID][] = (float)($row->Y);///100);//$meta["height"]);
	        $points[$row->TIME][$row->EXT_ID][] = (float)($row->X);///100);//$meta["width"]);
	    }



		foreach ($bbox as $key=>$item) {

			$frame++;

			$bounding_boxes = array();			

			if (isset($points[$frame])) {

				foreach ($points[$frame] as $ext=>$data) {

					// var_dump($data);

					$item["bounding_box_ids"][] = $ext;
					$item["bounding_boxes"][] = $data;

				}



			}


			// $item["bounding_boxes"] = $bounding_boxes;

			$output[$key] = $item;

		}

		// var_dump($output);

		// die();
		// for ($i = 0; $i < $length; $i++) {

		// 	$item = array();

		// 	$item["bounding_box_ids"] = array(0);
		// 	$item["bounding_boxes"] = array(0, 1, 2, 3);
		// 	$item["shot"] = "";

		// 	$output["hello".$i] = $item;

		// }		

	}


	header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
	header("Content-Type: application/force-download");
	header("Content-Type: application/octet-stream");
	header("Content-Type: application/download");
	header("Content-Disposition: attachment;filename=".$code."-".$mode.".json");

	echo str_replace("\/", "/", json_encode($output, JSON_PRETTY_PRINT));



?>