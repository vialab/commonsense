<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$db = $_POST["db"];

	$query = "SELECT * FROM RESOLUTIONS WHERE RESOLUTION_ID = '$db'";
	$result = $conn->query($query);

	$output = array();

    while ($row = $result->fetch_object()){
        $output = $row;
    }

    $result->close();


    $actors = json_decode($output->ACTORS);
    $edges = json_decode($output->EDGES);

    // var_dump($actors);
    // var_dump($edges);

    $actorResult = array();
    $edgeResult = array();

	$session = $_POST["session"];

    foreach ($actors as $item) {

	    $rand = rand(20, 80);
	    $rand2 = rand(20, 80);
	    $rand3 = rand(20, 80);
	    $rand4 = rand(20, 80);

	    $name = $item->name;
	    $id = $item->asset;

	    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?)");
	    $stmt->bind_param('iss', $id, $name, $session);


	    $stmt->execute();

	    $actorResult[$item->actor] = $stmt->insert_id;

    }


    foreach ($edges as $i=>$item) {

    	$order = $i;

    	$type = (int)$item->type; 
    	$direction = (int)$item->direction; 

		$actor0 = $actorResult[$item->actor0];
		$actor1 = $actorResult[$item->actor1];

		echo $query = "INSERT INTO INTERACTIONS (DESCRIPTION, `ORDER`, DIRECTION, TYPE, ACTOR_ID_0, ACTOR_ID_1) VALUES ('', $order, $direction, $type, $actor0, $actor1)";

	    $stmt = $conn->prepare($query);
	    $stmt->execute();




    }


?>