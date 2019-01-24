<?


	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();


	$scene = $_POST["scene"];


	$actions = file_get_contents("http://72.68.102.148:5001/api/scenes/".$scene."/graph-actions");
	$actions = json_decode($actions);


	$actionList = array();

	foreach ($actions->graph_actions as $item) {

		$actionList[$item->actor][] = $item;

	}


	$attributes = file_get_contents("http://72.68.102.148:5001/api/scenes/".$scene."/graph-characters");
	$attributes = json_decode($attributes);


	$attrList = array();

	foreach ($attributes->graph_characters as $item) {

		$attrList[$item->name][] = $item;

	}



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
						$dots->x = $dots->x / ($width_alt2 * 2.66) * 100;
						$dots->y = $dots->y / ($height_alt2 * 2.66) * 100;

						$mit[$object->object_name."-".$object->object_idx][($item->_idx+1)][] = $dots;


					}

				}



			}



		}


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
	        $main_id = $stmt->insert_id;

	        $tag = NULL;

	        $meta = "BODY";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();
	        $body_id = $stmt->insert_id;

	        $meta = "POSE";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();
	        $pose_id = $stmt->insert_id;

	        $meta = "FIGURE";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();
	        $figure_id = $stmt->insert_id;

	        $meta = "FACE";
	        $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
	        $stmt->execute();
	        $face_id = $stmt->insert_id;




			if (isset($faces[$name])) {

				foreach ($faces[$name] as $frame=>$item) {

					$actor = $face_id;

					$time = $frame+1;
				    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
				    $stmt->execute();

				    $db_id = $stmt->insert_id;


			    	$x0 = $item->x;
			    	$x1 = $item->x + $item->w;
			    	$y0 = $item->y;
			    	$y1 = $item->y + $item->h;

				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");


				}



			}

			if (isset($bodies[$name])) {

				foreach ($bodies[$name] as $frame=>$item) {

					$actor = $body_id;

					$time = $frame+1;
				    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
				    $stmt->execute();

				    $db_id = $stmt->insert_id;

			    	$x0 = $item->x;
			    	$x1 = $item->x + $item->w;
			    	$y0 = $item->y;
			    	$y1 = $item->y + $item->h;

				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");

				}

			} 		


			if (isset($pose[$name])) {

				foreach ($pose[$name] as $frame=>$item) {

					$actor = $pose_id;

					$time = $frame+1;

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
		    	}

		    }

			if (isset($actionList[$name])) {

				foreach ($actionList[$name] as $i=>$item) {

					$length = (int)($item->end * 24) - (int)($item->start * 24);
			        $actor_id = $main_id;


			        $asset_id = 18391;
			        $meta = "ALL";
			    	$event_name = $item->name;

			        $rand = rand(20, 80);
			        $rand2 = rand(20, 80);
			        $rand3 = rand(20, 80);
			        $rand4= rand(20, 80);


			        $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?)");
			        $stmt->bind_param('isss', $asset_id, $event_name, $session, $meta);
			        $stmt->execute();

			        $event_id = $stmt->insert_id;

			        $order = (int)($item->start * 24);

				    $stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE, LENGTH) VALUES ('', $actor_id, $event_id, $order, 2, 1, $length)");
				    $stmt->execute();


				    // echo $event_id;
				    // echo "\n";


				}

			}



			if (isset($attrList[$name])) {


				foreach ($attrList[$name] as $i=>$item) {


					foreach ($item as $k=>$v) {

						if ($k == "name") {

							continue;

						}

						$label = $k;
						$value = $v;
						$asset_id = $main_id;
						$type_id = 9;

				    	$stmt = $conn->prepare("INSERT INTO ATTRIBUTES (ACTOR_ID, LABEL, VALUE, ATTRIBUTE_TYPE_ID) VALUES (?, ?, ?, ?)");
					    $stmt->bind_param('issi', $asset_id, $label, $value, $type_id);

				    	$stmt->execute();


					}


				}

			}







			$resolution_name = array($name2);
			$resolution_name = json_encode($resolution_name);
			$resolution_name = str_replace("'", "\'", $resolution_name);

			$query = "SELECT * FROM RESOLUTIONS WHERE NAMES = '$resolution_name' ORDER BY RESOLUTION_ID DESC LIMIT 1";
			$result = $conn->query($query);

			$output = array();

		    while ($row = $result->fetch_object()){
		        $output = $row;
		    }

		    if ($result->num_rows > 0) {


				$group = uniqid();

			    $stmt = $conn->prepare("UPDATE ACTORS SET `GROUP` = ? WHERE ACTOR_ID = ?");
			    $stmt->bind_param('ss', $group, $main_id);
			    $stmt->execute();

			    $actors = json_decode($output->ACTORS);
			    $edges = json_decode($output->EDGES);

			    $actorResult = array();
			    $edgeResult = array();

			    var_dump($actors);
			    var_dump($edges);

			    foreach ($actors as $item) {

				    $rand = rand(20, 80);
				    $rand2 = rand(20, 80);
				    $rand3 = rand(20, 80);
				    $rand4 = rand(20, 80);

				    $name = $item->name;
				    $asset_id = $item->asset;

				    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, `GROUP`) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?)");
				    $stmt->bind_param('isss', $asset_id, $name, $session, $group);

				    $stmt->execute();

				    $actorResult[$item->actor] = $stmt->insert_id;

			    }


			    foreach ($edges as $i=>$item) {

			    	$order = $i;

			    	$type = (int)$item->type; 
			    	$direction = (int)$item->direction; 

					$actor0 = $actorResult[$item->actor0];
					$actor1 = $actorResult[$item->actor1];

					$query = "INSERT INTO INTERACTIONS (DESCRIPTION, `ORDER`, DIRECTION, TYPE, ACTOR_ID_0, ACTOR_ID_1) VALUES ('', $order, $direction, $type, $actor0, $actor1)";

				    $stmt = $conn->prepare($query);
				    $stmt->execute();




			    }

		    }



		}



		foreach ($mit as $name=>$list) {

			$name2 = $name;

			if (strpos($name, "person") === false) {

				continue;

			}


			if (isset($position[$name])) {

				$rand = $position[$name][$x];
				$rand2 = $position[$name][$y];

			} else {

				$rand = rand(0,100);
				$rand2 = rand(0,100);

			}



			$rand = rand(0,100);
			$rand2 = rand(0,100);

		    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID) VALUES (18389, ?, 50, 50, ?, ?, 0, 0, 0, 0, ?, 'FIGURE', '".md5($name)."')");
		    $stmt->bind_param('siis', $name2, $rand, $rand2, $session);
		    $stmt->execute();

		    $actor = $stmt->insert_id;


		    foreach ($list as $frame=>$dots) {


		    	$time = $frame;

			    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
			    $stmt->execute();

			    $db_id = $stmt->insert_id;

			    $i = 0;

		    	foreach ($dots as $dot) {


			    	$time = $dot->frame;


			    	$x0 = $dot->x;
			    	$y0 = $dot->y;		    	

			    	if ($x0 == 0 && $y0 == 0) {


		    		} else {


						if($i % 30 == 0) {

						    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");

						}


				    	$i++;


			    	}




		    	}


		    }

		}


		foreach ($mit as $name=>$list) {

			$name2 = $name;

			if (strpos($name, "person") !== false) {

				continue;

			}


			if (isset($position[$name])) {

				$rand = $position[$name][$x];
				$rand2 = $position[$name][$y];

			} else {

				$rand = rand(0,100);
				$rand2 = rand(0,100);

			}

		    // $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID) VALUES (18389, ?, 50, 50, ?, ?, 0, 0, 0, 0, ?, 'MIT-NEW', '".md5($name)."')");
		    // $stmt->bind_param('siis', $name2, $rand, $rand2, $session);
		    // $stmt->execute();

		    // $actor = $stmt->insert_id;


			// $name2 = "(".$name.")";




			$rand = rand(0,100);
			$rand2 = rand(0,100);

		    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID) VALUES (18389, ?, 50, 50, ?, ?, 0, 0, 0, 0, ?, 'OUTLINE', '".md5($name)."')");
		    $stmt->bind_param('siis', $name2, $rand, $rand2, $session);
		    $stmt->execute();

		    $actor = $stmt->insert_id;


		    foreach ($list as $frame=>$dots) {


		    	$time = $frame;

			    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
			    $stmt->execute();

			    $db_id = $stmt->insert_id;

			    $i = 0;

		    	foreach ($dots as $dot) {


			    	$time = $dot->frame;

			    	// echo $time;
			    	// echo "\n";


			    	//continue;

			    	$x0 = $dot->x;
			    	$y0 = $dot->y;		    	

			    	if ($x0 == 0 && $y0 == 0) {


		    		} else {


						if($i % 30 == 0) {

						    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");

						}


				    	$i++;


			    	}




		    	}


		    }

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