<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();


	$session = $_POST["session"];
    $actor = $_POST["db"];
    $face_id = $_POST["db"];
    $scene = $_POST["scene"];
    $length = $_POST["length"];

    $query = "SELECT EXT_ID, NAME FROM ACTORS WHERE ACTOR_ID = $actor LIMIT 1";
    $result = $conn->query($query);          

    $ext_id = "";

    while ($row = $result->fetch_object()){

		$ext_id = $row->EXT_ID;
		$name2 = $row->NAME;

    };




    $query = "SELECT ACTOR_ID, EXT_ID, NAME FROM ACTORS WHERE ACTORS.SESSION = '$session' AND ACTORS.META = 'BODY' AND ACTORS.EXT_ID = '$ext_id' LIMIT 1";
    $result = $conn->query($query);          

    while ($row = $result->fetch_object()){

		$body_id = $row->ACTOR_ID;

    };


    $query = "SELECT ACTOR_ID, EXT_ID, NAME FROM ACTORS WHERE ACTORS.SESSION = '$session' AND ACTORS.META = 'POSE' AND ACTORS.EXT_ID = '$ext_id' LIMIT 1";
    $result = $conn->query($query);          

    while ($row = $result->fetch_object()){

		$pose_id = $row->ACTOR_ID;

    };



    $frames = array();


    // for ($i = 1; $i <= $length; $i++) {

    // 	$frames[$i] = array();

    // }



	$query = "SELECT ACTORS.META, ACTORS.NAME AS ACTOR_NAME, OVERLAYS.*, ACTORS.ACTOR_ID AS ACTOR_ID_ALT, ASSETS.*, OVERLAY_POINTS.* FROM ACTORS INNER JOIN ASSETS ON ASSETS.ASSET_ID = ACTORS.ASSET_ID LEFT JOIN OVERLAYS ON OVERLAYS.ACTOR_ID = ACTORS.ACTOR_ID LEFT JOIN OVERLAY_POINTS ON OVERLAY_POINTS.OVERLAY_ID = OVERLAYS.OVERLAY_ID WHERE ACTORS.SESSION = '$session' AND (ASSETS.ASSET_TYPE_ID = 1 OR ASSETS.ASSET_TYPE_ID = 2) AND ACTORS.META = 'FACE' AND ACTORS.EXT_ID = '$ext_id' AND ACTORS.TAG IS NULL  ORDER BY ACTORS.ACTOR_ID ASC";

    $result = $conn->query($query);


    while ($row = $result->fetch_object()){

	    // for ($i = $row->TIME - 48; $i <= $row->TIME + 48; $i++) {

	    	// if ($i >= 1 && $i <= $length) {

				$frames[$row->TIME][] = $row;

	    	// }


	    // }



    }	





	$query = "SELECT ACTORS.META, ACTORS.NAME AS ACTOR_NAME, OVERLAYS.*, ACTORS.ACTOR_ID AS ACTOR_ID_ALT, ASSETS.*, OVERLAY_POINTS.* FROM ACTORS INNER JOIN ASSETS ON ASSETS.ASSET_ID = ACTORS.ASSET_ID LEFT JOIN OVERLAYS ON OVERLAYS.ACTOR_ID = ACTORS.ACTOR_ID LEFT JOIN OVERLAY_POINTS ON OVERLAY_POINTS.OVERLAY_ID = OVERLAYS.OVERLAY_ID WHERE ACTORS.SESSION = '$session' AND (ASSETS.ASSET_TYPE_ID = 1 OR ASSETS.ASSET_TYPE_ID = 2) AND ACTORS.META = 'BODY' AND ACTORS.EXT_ID = '$ext_id' AND ACTORS.TAG IS NULL  ORDER BY ACTORS.ACTOR_ID ASC";

    $result = $conn->query($query);



    while ($row = $result->fetch_object()){

    	if (isset($frames[$row->TIME])) {

    		unset($frames[$row->TIME]);

    	}

    }	



	$query = "SELECT ACTORS.META, ACTORS.NAME AS ACTOR_NAME, OVERLAYS.*, ACTORS.ACTOR_ID AS ACTOR_ID_ALT, ASSETS.*, OVERLAY_POINTS.* FROM ACTORS INNER JOIN ASSETS ON ASSETS.ASSET_ID = ACTORS.ASSET_ID LEFT JOIN OVERLAYS ON OVERLAYS.ACTOR_ID = ACTORS.ACTOR_ID LEFT JOIN OVERLAY_POINTS ON OVERLAY_POINTS.OVERLAY_ID = OVERLAYS.OVERLAY_ID WHERE ACTORS.SESSION = '$session' AND (ASSETS.ASSET_TYPE_ID = 1 OR ASSETS.ASSET_TYPE_ID = 2) AND ACTORS.META = 'POSE' AND ACTORS.EXT_ID = '$ext_id' AND ACTORS.TAG IS NULL  ORDER BY ACTORS.ACTOR_ID ASC";

    $result = $conn->query($query);



    while ($row = $result->fetch_object()){

    	if (isset($frames[$row->TIME])) {

    		unset($frames[$row->TIME]);

    	}

    }	




	$query = "SELECT ACTORS.META, ACTORS.NAME AS ACTOR_NAME, OVERLAYS.*, ACTORS.ACTOR_ID AS ACTOR_ID_ALT, ASSETS.*, OVERLAY_POINTS.* FROM ACTORS INNER JOIN ASSETS ON ASSETS.ASSET_ID = ACTORS.ASSET_ID LEFT JOIN OVERLAYS ON OVERLAYS.ACTOR_ID = ACTORS.ACTOR_ID LEFT JOIN OVERLAY_POINTS ON OVERLAY_POINTS.OVERLAY_ID = OVERLAYS.OVERLAY_ID WHERE ACTORS.SESSION = '$session' AND (ASSETS.ASSET_TYPE_ID = 1 OR ASSETS.ASSET_TYPE_ID = 2) AND ACTORS.META = 'POSE' AND ACTORS.EXT_ID = '$ext_id' AND ACTORS.TAG IS NULL  ORDER BY ACTORS.ACTOR_ID ASC";

    $result = $conn->query($query);



    while ($row = $result->fetch_object()){

    	if (isset($frames[$row->TIME])) {

    		unset($frames[$row->TIME]);

    	}

    }	





    foreach ($frames as $frame=>$item) {

    	if (count($item) == 0) {

    		$frames[$frame] = $data;

    	} else {

    		$data = $item;

    	}

    }



    $list["frames"] = array();

	$width_alt = 480 * 2;
	$height_alt = 203.984 * 2;

	$width_alt2 = 480;
	$height_alt2 = 203.984;

	$framelist = array();
	$idlist = array();

    foreach ($frames as $frame=>$item) {

    	$obj = array();
    	$temp = array();

    	$obj["_idx"] = (int)$frame-1;

    	$temp["x0"] = (float)$item[0]->X;
    	$temp["y0"] = (float)$item[0]->Y;
    	$temp["x1"] = (float)$item[1]->X;
    	$temp["y1"] = (float)$item[1]->Y;

    	if ($temp["x0"] > $temp["x1"]) {

    		$obj["x"] = $temp["x1"];

    	} else {

    		$obj["x"] = $temp["x0"];

    	}


    	if ($temp["y0"] > $temp["y1"]) {

    		$obj["y"] = $temp["y1"];

    	} else {

    		$obj["y"] = $temp["y0"];

    	}


		$obj["h"] = abs($temp["y0"] - $temp["y1"]);
		$obj["w"] = abs($temp["x0"] - $temp["x1"]);


		$obj["x"] = round($obj["x"] / 100 * $width_alt);
		$obj["y"] = round($obj["y"] / 100 * $height_alt);
		$obj["h"] = round($obj["h"] / 100 * $height_alt);
		$obj["w"] = round($obj["w"] / 100 * $width_alt);



    	$list["frames"][] = $obj;

    	$framelist[] = (int)$frame;


    }

    // var_dump($list["frames"]);

    $matched = count($list["frames"]);




    if (count($list["frames"]) > 0) {


	    $list = json_encode($list);


		$ch = curl_init();
		$url = "http://72.68.102.148:5001/api/scenes/$scene/matched-detector-entity";

		// {
		//   "frames":
		//   [
		//     {
		//       "_idx": 990,
		//       "x": 655,
		//       "y": 104,
		//       "w": 77,
		//       "h": 75
		//     }
		//   ]
		// }

		// $list = '{"frames":[{"_idx":990,"x":660,"y":101,"h":71,"w":76}]}';
		// $list = '"{\n  \"frames\":\n  [\n    {\n      \"_idx\": 990,\n      \"x\": 655,\n      \"y\": 104,\n      \"w\": 77,\n      \"h\": 75\n    }\n  ]\n}"';

		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $list);
		curl_setopt($ch, CURLOPT_POST, 1);

		$headers = array();
		$headers[] = "Content-Type: application/json";
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$result = curl_exec($ch);
		if (curl_errno($ch)) {
		    echo 'Error:' . curl_error($ch);
		}
		curl_close ($ch);    


		$response = json_decode($result);


		$resultcount = 0;

		foreach ($response->linked_people as $i=>$person) {


			if (count($person->openpose_data) == 54) {


				$openpose = array_chunk($person->openpose_data, 3);


				$id = 18389;
		        $extid = $ext_id;
		        $meta = "BODY";
		        $tag = NULL;

		        $rand = rand(20, 80);
		        $rand2 = rand(20, 80);
		        $rand3 = rand(20, 80);
		        $rand4= rand(20, 80);



				$actor = $pose_id;
				$time = $framelist[$i]+1;
			    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
			    $stmt->execute();

			    $db_id = $stmt->insert_id;



				$resultcount++;

				foreach ($openpose as $dot) {

					$poseItem = new stdClass();
					$poseItem->x = $dot[0] / $width_alt2 * 100;
					$poseItem->y = $dot[1] / $height_alt2 * 100;
					$poseItem->frame = $face->frame;



			    	$x0 = $poseItem->x;
			    	$y0 = $poseItem->y;		    	

			    	if ($x0 <= 5 && $y0 <= 5) {

					    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y, HIDE) VALUES ($db_id, $x0, $y0, 1)");

		    		} else {


					    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");


			    	}





				}



			}


			$body = new stdClass();

			$body->w = $person->darknet_data->Bbox[2] / $width_alt2 * 100;
			$body->h = $person->darknet_data->Bbox[3] / $height_alt2 * 100;
			$body->x = $person->darknet_data->Bbox[0] / $width_alt2 * 100;
			$body->y = $person->darknet_data->Bbox[1] / $height_alt2 *  100;
			$body->frame = $face->frame;

			$actor = $body_id;
			$time = $framelist[$i]+1;
		    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
		    $stmt->execute();

		    $db_id = $stmt->insert_id;

	    	$x0 = $body->x;
	    	$x1 = $body->x + $body->w;
	    	$y0 = $body->y;
	    	$y1 = $body->y + $body->h;

		    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
		    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");


			$resultcount++;





			// $actor = $face_id;
			// $time = $framelist[$i]+1;
		 //    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
		 //    $stmt->execute();

		 //    $db_id = $stmt->insert_id;

		 //    $face = $person->face_data;

			// $face->w = $face->w / $width_alt * 100;
			// $face->h = $face->h / $height_alt * 100;
			// $face->x = $face->x / $width_alt * 100;
			// $face->y = $face->y / $height_alt*  100;

	  //   	$x0 = $face->x;
	  //   	$x1 = $face->x + $face->w;
	  //   	$y0 = $face->y;
	  //   	$y1 = $face->y + $face->h;

		 //    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
		 //    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");

			// $resultcount++;



		}


	    // var_dump($frames);

		echo $resultcount;

	    die();
 


    } else {

    	die("No available frames.");

    }



?>