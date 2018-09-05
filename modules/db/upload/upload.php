<?

	ini_set('memory_limit', '-1');

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();


	$code = $_POST["code"];

	$content = "";
	$name = "";

	$query = "SELECT * FROM FILES WHERE CODE = '$code' LIMIT 1";

	$result = $conn->query($query);

    while ($row = $result->fetch_object()){

        $content .= $row->CONTENT;
        $name = $row->NAME;

        $type = $row->TYPE;
        $typeArray = explode("/", $type);
        $extension = $typeArray[1];

        $code = $row->CODE;

        $unique = uniqid();

        $path = $_SERVER["DOCUMENT_ROOT"]."/assets/".$row->CODE;
        $destination = $_SERVER["DOCUMENT_ROOT"]."/cache/".$unique.".".$extension;
  
        copy($path, $destination);
        $nodes = file_get_contents($destination);
		$data = json_decode($nodes, true);

    }



	$session = $_POST["session"];
	$nodes = $data["nodes"];

    // echo $nodes;
	$array = json_decode($nodes);



	$types = array("entity", "action", "summary", "interaction");

	$nodeList = array();
	$nodeList2 = array();

	$xArray = array();
	$yArray = array();


	foreach ($types as $type) {

		if (isset($array->{$type})) {

			foreach ($array->{$type} as $subtype=>$list) {

				if (($type == "entity" && $subtype == "default") || ($type == "action" && $subtype == "default") || ($type == "summary" && $subtype == "default") || ($type == "interaction" && $subtype == "default")) {

					foreach ($list as $node) {

						$xArray[] = $node->x;
						$yArray[] = $node->y;

					}

				}

			}

		}

	}

	// var_dump($data);
	// var_dump($xArray);
	// var_dump($yArray);


	$xMax = max($xArray);
	$xMin = min($xArray);

	$yMax = max($yArray);
	$yMin = min($yArray);

	foreach ($types as $type) {

		if (isset($array->{$type})) {

			foreach ($array->{$type} as $subtype=>$list) {

				if (($type == "entity" && $subtype == "default") || ($type == "action" && $subtype == "default") || ($type == "summary" && $subtype == "default") || ($type == "interaction" && $subtype == "default")) {

					foreach ($list as $node) {

						$name = $node->name;

						$meta = "";
						
						if ($type == "entity") {

						    $id = 18389;
						    $meta = "MAIN";

						} else if ($type == "action") {

					    	$id = 18391;
						    $meta = "ALL";

						} else if ($type == "interaction") {

					    	$id = 18391;
						    $meta = "ALL";

						} else if ($type == "summary") {

					    	$id = 18391;
						    $meta = "ALL";

						}							  

						// } else if ($subtype == "object") {

						//     $id = 18390;

						// }

					    $x = ($node->x - $xMin) / ($xMax - $xMin) * (90 - 10) + 10;
					    $y = ($node->y - $yMin) / ($yMax - $yMin) * (90 - 10) + 10;

					    $name = str_replace("Forrest Gump", "Young Forrest Gump", $name);

					    $extid = md5($name);

						if ($type == "entity") {

						    $query = "SELECT * FROM ACTORS WHERE EXT_ID = '$extid' AND SESSION = '$session' AND META = 'MAIN'";
						    $result = $conn->query($query);            

						    if ($result->num_rows > 0) {

						        while ($row = $result->fetch_object()){
						            $item = $row;
						        }

							    $nodeList[$node->node_id] = $item->ACTOR_ID;
							    $nodeList2[$type][$node->node_id] = $item->ACTOR_ID;

						    } else {

							    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID) VALUES (?, ?, 50, 50, ?, ?, 0, 0, 0, 0, ?, ?, ?)");
							    $stmt->bind_param('isddsss', $id, $name, $x, $y, $session, $meta, $extid);
							    $stmt->execute();

							    $nodeList[$node->node_id] = $stmt->insert_id;
							    $nodeList2[$type][$node->node_id] = $stmt->insert_id;
							    	



				                $meta = "FACE";
				                $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID) VALUES (?, ?, 50, 50, 50, 50, 0, 0, 0, 0, ?, ?, ?)");
				                $stmt->bind_param('issss', $id, $name, $session, $meta, $extid);
				                $stmt->execute();

				                $meta = "BODY";
				                $stmt->bind_param('issss', $id, $name, $session, $meta, $extid);
				                $stmt->execute();

				                $meta = "POSE";
				                $stmt->bind_param('issss', $id, $name, $session, $meta, $extid);
				                $stmt->execute();

				                $meta = "FIGURE";
				                $stmt->bind_param('issss', $id, $name, $session, $meta, $extid);
				                $stmt->execute();



						    }

						} else {


						    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID) VALUES (?, ?, 50, 50, ?, ?, 0, 0, 0, 0, ?, ?, ?)");
						    $stmt->bind_param('isddsss', $id, $name, $x, $y, $session, $meta, $extid);
						    $stmt->execute();

						    $nodeList[$node->node_id] = $stmt->insert_id;
						    $nodeList2[$type][$node->node_id] = $stmt->insert_id;


						}


					}

				}

			}

		}


	}


	$edges = $data["edges"];
	$edges = json_decode($edges);

	// var_dump($nodeList);
	$edgeList = array();

	$orderPreset = 1;

	foreach ($edges as $edge) {

		if (isset($nodeList[$edge->node_one]) && isset($nodeList[$edge->node_two])) {

			$order = $orderPreset;
			$actor0 = $nodeList[$edge->node_one];
			$actor1 = $nodeList[$edge->node_two];
			$type = 1;

			if ($edge->bidirectional == 2) {

				$direction = 2;

			} else {

				$direction = 0;

			}

		    $stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE) VALUES ('', $actor0, $actor1, $order, $direction, $type)");
		    $stmt->execute();

		    $edgeList[$edge->edge_id] = $stmt->insert_id;

		    $orderPreset += 0.25;

		}

	}




	$attributeList = array();

	$types = array("attribute");

	foreach ($types as $type) {

		if (isset($array->{$type})) {

			foreach ($array->{$type} as $subtype=>$list) {

				foreach ($list as $node) {

					foreach ($edges as $edge) {

						$actor = null;

						if ($edge->node_one == $node->node_id && isset($nodeList[$edge->node_two])) {

							$actor = $nodeList[$edge->node_two];

						} else if ($edge->node_two == $node->node_id && isset($nodeList[$edge->node_one])) {

							$actor = $nodeList[$edge->node_one];

						}

						if ($actor != null) {

							// var_dump($actor);
							// var_dump($node);


							$label = $node->subtype;
							$value = $node->name;

							// var_dump($actor);
							// var_dump($label);
							// var_dump($value);

							$type = 9;

					    	$stmt = $conn->prepare("INSERT INTO ATTRIBUTES (ACTOR_ID, LABEL, VALUE, ATTRIBUTE_TYPE_ID) VALUES (?, ?, ?, ?)");
						    $stmt->bind_param('issi', $actor, $label, $value, $type);

					    	$stmt->execute();

						    $attributeList[$node->subtype][$node->node_id] = $stmt->insert_id;


						}

					}

				}


			}

		}


	}


    $output = array();
    $output["edges"] = $edgeList;
    $output["nodes"] = $nodeList2;
    $output["attributes"] = $attributeList;


    echo json_encode($output);


    $conn->close();


 //    $name = $_POST["name"];
	// $name2 = "(".$_POST["name"].")";
 //    $id = $_POST["id"];

 //    // $stmt = $conn->prepare("INSERT INTO PROPS (NAME, PROP_TYPE, PROP_TYPE_ID) VALUES (?, ?, ?)");
 //    // $stmt->bind_param('ssi', $name2, $name, $id);
 //    // $stmt->execute();

 //    // $prop_id = $stmt->insert_id;


 //    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION) VALUES (?, ?, 50, 50, 50, 50, 0, 0, 0, 0, ?)");
 //    $stmt->bind_param('iss', $id, $name2, $session);
 //    $stmt->execute();


 //    $conn->close();


?>