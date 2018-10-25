<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();
	$session = $_POST["session"];

	// var_dump($_POST);

	$group = uniqid();


	$names = json_encode($_POST["names"]);
	$actors = json_encode($_POST["actors"]);
	$edges = json_encode($_POST["edges"]);

    $query = "INSERT INTO RESOLUTIONS (NAMES, ACTORS, EDGES) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('sss', $names, $actors, $edges);	
    $stmt->execute();

    foreach ($_POST["target"] as $id) {



	    $stmt = $conn->prepare("UPDATE ACTORS SET `GROUP` = ? WHERE ACTOR_ID = ?");
	    $stmt->bind_param('ss', $group, $id);
	    $stmt->execute();



    }


	die();

	$actor0 = null;

	echo $resolution = json_encode($_POST["list"]);
	echo $resolution_name = $_POST["resolution_name"];

	var_dump($_POST);


    echo $query = "INSERT INTO RESOLUTIONS (ORIGIN_NAME, RESOLUTION) VALUES (?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ss', $resolution_name, $resolution);	
    $stmt->execute();

	foreach ($_POST["list"] as $i=>$item) {

	    $rand = rand(20, 80);
	    $rand2 = rand(20, 80);
	    $rand3 = rand(20, 80);
	    $rand4= rand(20, 80);

	    $asset = (int)$item["asset"];
	    $name = (string)$item["name"];

	    $query = "INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, `GROUP`) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?)";
	    // echo $query;
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param('isss', $asset, $name, $session, $group);

	    $stmt->execute();


	    if ($actor0 != null) {



			$actor1 = $stmt->insert_id;


			$type = 3;

			if ($assettype == 1 && $item["type"] == 3) {

				$type = 1;

			}

			if ($assettype == 1 && $item["type"] == 4) {

				$type = 2;

			}

			
			if ($assettype == 2 && $item["type"] == 4) {

				$type = 2;

			}



			$direction = $_POST["list"][$i-1]["direction"];
			$order = 1;

			echo $query = "INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE) VALUES ('', $actor0, $actor1, $order, $direction, $type)";
	    	$conn->query($query);	    

	    }

		$actor0 = $stmt->insert_id;
		$assettype = (int)$item["type"];



	}



    foreach ($_POST["target"] as $id) {



	    $stmt = $conn->prepare("UPDATE ACTORS SET `GROUP` = ? WHERE ACTOR_ID = ?");
	    $stmt->bind_param('ss', $group, $id);
	    $stmt->execute();



    }



    $conn->close();


?>