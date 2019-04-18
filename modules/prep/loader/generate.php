<?

    include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$video = $_POST["file"];
	$length = $_POST["frames"];

	$original = file_get_contents($_SERVER["DOCUMENT_ROOT"]."/temp/graph_template2.json");
	$json = "";



    $code = strtoupper(md5($video))."_".generate_code();

    $videocontent = file_get_contents($video);
    $path = $_SERVER["DOCUMENT_ROOT"]."/assets/".$code;
    file_put_contents($path, $videocontent);

	$size = filesize($path);

	$type = "video/mp4";
	$name = "$code.mp4";

	$query = "INSERT INTO FILES (CODE, TYPE, NAME, LENGTH) VALUES ('$code', '$type', '$name', $size);";
	$conn = init_sql();
	$conn->query($query);



	$uniqid = uniqid();

	$content = $original;
	$content = str_replace("{VIDEO}", $code.":".$length, $content);
	$content = str_replace("{JSON}", $json, $content);

	$content = str_replace("\n", "", $content);
	$content = str_replace("\t", "", $content);

	$content = str_replace("{END}", "GRAPHEND", $content);
	$content = str_replace("{HEADLINE}", "START", $content);
	$content = str_replace("{TITLE}", "AUTO-GENERATED - ".$uniqid, $content);



	$record = array();
	$record["width"] = $_POST["width"];
	$record["height"] = $_POST["height"];


	$values = array();

	$frame = 0;
	$totalframe = $_POST["frames"];
	$actor_db = array();
	$session = $code;


	$id = 2980;
	$name = "CAMERA";
	$extid = "CAMERA";

    $meta = "MAIN";
    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID, SOURCE) VALUES (?, ?, 50, 50, ?, ?, 0, 0, 0, 0, ?, ?, ?, ?)");
    $stmt->bind_param('isddssss', $id, $name, $x, $y, $session, $meta, $extid, $source);
    $stmt->execute();

    $camera_id = $stmt->insert_id;



	if (isset($_POST["bbox"]) && $_POST["bbox"] != "") {

		$json = file_get_contents($_POST["bbox"]);
		$bbox = json_decode($json, true);

		$record["bbox"] = $bbox;

		foreach ($bbox as $clip => $item) {

			$frame++;
			// $totalframe++;

			foreach ($item["bounding_box_ids"] as $key => $id) {

				$ext = $id;
				// $values = $item["bounding_box_ids"]

				$coordinates = $item["bounding_boxes"][$key];


				$values[$ext][$frame] = $coordinates;


			}


		}


		foreach ($values as $ext=>$list) {


			$id = 18389;
			$name = $ext;
			$extid = $ext;

	        $meta = "MAIN";
		    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID, SOURCE) VALUES (?, ?, 50, 50, ?, ?, 0, 0, 0, 0, ?, ?, ?, ?)");
		    $stmt->bind_param('isddssss', $id, $name, $x, $y, $session, $meta, $extid, $source);
		    $stmt->execute();
	        $main_id = $stmt->insert_id;

	        $actor_db[$ext] = $main_id;

	        // $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID, SOURCE) VALUES (?, ?, 50, 50, 50, 50, 0, 0, 0, 0, ?, ?, ?, ?)");

	        // $meta = "BODY";
	        // $stmt->bind_param('isssss', $id, $name, $session, $meta, $extid, $source);
	        // $stmt->execute();

	        // $meta = "POSE";
	        // $stmt->bind_param('isssss', $id, $name, $session, $meta, $extid, $source);
	        // $stmt->execute();

	        // $meta = "FIGURE";
	        // $stmt->bind_param('isssss', $id, $name, $session, $meta, $extid, $source);
	        // $stmt->execute();

	        // $meta = "FACE";
	        // $stmt->bind_param('isssss', $id, $name, $session, $meta, $extid, $source);
	        // $stmt->execute();        

	        // $face_id = $stmt->insert_id;
			$actor = $main_id;

			foreach ($list as $frame=>$data) {

				$time = $frame;

			    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
			    $stmt->execute();

			    $db_id = $stmt->insert_id;

		    	$x0 = $data[1]/$_POST["width"]*100;
		    	$x1 = $data[3]/$_POST["width"]*100;
		    	$y0 = $data[0]/$_POST["height"]*100;
		    	$y1 = $data[2]/$_POST["height"]*100;

			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");


			}


		}


	}







	if (isset($_POST["estimate"]) && $_POST["estimate"] != "") {


		$json = file_get_contents($_POST["estimate"]);
		$top = json_decode($json, true);

		$xArray = array();
		$yArray = array();
		$zArray = array();

		foreach ($top["cameras"] as $camera) {

			$xArray[] = $camera[1];
			$yArray[] = $camera[2];
			$zArray[] = $camera[0];

		}


		foreach ($top["people"] as $index => $list) {
			
			foreach ($list as $item) {


				$xArray[] = $item[1];
				$yArray[] = $item[2];
				$zArray[] = $item[0];

			}

			
		}


		$xMin = min($xArray);
		$xMax = max($xArray);
		$yMax = max($yArray);
		$yMin = min($yArray);

		$zMax = max($zArray);
		$zMin = min($zArray);

		$xOffset = 0;
		$yOffset = 0;



		if ($xMin < 0) {

			$xOffset = abs($xMin);
			$xMin = 0;
			$xMax += $xOffset;

		}




		if ($yMin < 0) {

			$yOffset = abs($yMin);
			$yMin = 0;
			$yMax += $yOffset;

		}		



		if ($zMin < 0) {

			// $zOffset = abs($zMin);
			// $zMin = 0;
			// $zMax += $zOffset;

		}



		$record["camera"] = $top;


		$prevX = null;
		$prevY = null;
		$prevZ = null;


		foreach ($top["cameras"] as $key => $camera) {

			$x = ($camera[1] + $xOffset) / $xMax * 80 + 10;
			$y = 100 - (($camera[2] + $yOffset) / $yMax * 80 + 10);
			// $z = ($camera[0] + $zOffset) / $zMax * 360 + 180;
			$z = rad2deg($camera[0]) + 90;

			// if ($z < 0) { // BETWEEN -270 and 0

			// 	$z += 360;

			// }			

			if ($prevX != $x || $prevY != $x || $prevZ != $z) {

				$time = $key+1;

			    $stmt = $conn->prepare("INSERT INTO FRAMES (ACTOR_ID, FRAME_NUM, X, Y, RZ) VALUES (?, ?, ?, ?, ?)");
			    $stmt->bind_param('iiddd', $camera_id, $time, $x, $y, $z);		
		    	$stmt->execute();

				$prevX = $x;
				$prevY = $y;
				$prevZ = $z;

			}

		


		}



		foreach ($top["people"] as $index => $list) {
			
			$main_id = $actor_db[$index];

			foreach ($list as $key => $item) {

				$x = ($item[1] + $xOffset) / $xMax * 80 + 10;
				$y = 100 - (($item[2] + $yOffset) / $yMax * 80 + 10);
				// $z = ($item[0] + $zOffset) / $zMax * 360 + 180;
				$z = rad2deg($item[0]) - 90;


				// if ($z < 0) { // BETWEEN -270 and 0

				// 	$z += 360;

				// }			


				if ($prevX != $x || $prevY != $x || $prevZ != $z) {

					$time = $key+1;

				    $stmt = $conn->prepare("INSERT INTO FRAMES (ACTOR_ID, FRAME_NUM, X, Y, RZ) VALUES (?, ?, ?, ?, ?)");
				    $stmt->bind_param('iiddd', $main_id, $time, $x, $y, $z);			
			    	$stmt->execute();

					$prevX = $x;
					$prevY = $y;
					$prevZ = $z;


			    }


			}

			
		}






	} else {


		// for ($i = 0; $i < $totalframe; $i++) {

		//     $stmt = $conn->prepare("INSERT INTO FRAMES (ACTOR_ID, FRAME_NUM) VALUES (?, ?)");
		//     $stmt->bind_param('ii', $camera_id, $i);		
	 //    	$stmt->execute();

		// }

		// foreach ($actor_db as $ext=>$main_id) {

		// 	for ($i = 0; $i < $totalframe; $i++) {

		// 	    $stmt = $conn->prepare("INSERT INTO FRAMES (ACTOR_ID, FRAME_NUM) VALUES (?, ?)");
		// 	    $stmt->bind_param('ii', $main_id, $i);		
		//     	$stmt->execute();

		// 	}

		// }

	}

	// echo $camera_id;
	// var_dump($actor_db);

	$json = json_encode($record);



	$query = "INSERT INTO LAYOUTS (CODE, JSON, META) VALUES ('$code', '$content', '$json');";
	$conn->query($query);




	$conn->close();

	echo $code;


	// $code = "GRAPH".$i."LAYOUT";

	// //$query = "INSERT INTO LAYOUTS (CODE, JSON) VALUES ('$code', '$content');";
	// $query = "UPDATE LAYOUTS SET JSON = '$content' WHERE CODE = '$code';";

	// echo $query;
	// echo "\n";


?>