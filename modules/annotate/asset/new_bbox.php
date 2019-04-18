<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$actor_id = $_POST["actor_id"];
	$time = $_POST["time"];

	$query = "SELECT OVERLAY_ID FROM OVERLAYS WHERE ACTOR_ID = $actor_id AND `TIME` = '$time'";
	$result = $conn->query($query);

	$output = array();

	if ($result->num_rows == 0) {

	    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor_id, $time)");
	    $stmt->execute();

	    $overlay_id = $stmt->insert_id;


	    $x1 = $_POST["x1"];
	    $y1 = $_POST["y1"];
	    $x2 = $_POST["x2"];
	    $y2 = $_POST["y2"];

	    if ($x1 == null) {

	    	$x1 = 25;
	    	$y1 = 25;

	    }

	    if ($x2 == null) {

	    	$x2 = 75;
	    	$y2 = 75;

	    }


	    $stmt = $conn->prepare("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($overlay_id, $x1, $y1)");
	    $stmt->execute();

	    $pointA = $stmt->insert_id;

	    $stmt = $conn->prepare("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($overlay_id, $x2, $y2)");
	    $stmt->execute();

	    $pointB = $stmt->insert_id;


	    $output["overlay"] = $overlay_id;
	    $output["point_0"]["id"] = $pointA;
	    $output["point_0"]["x"] = $x1;
	    $output["point_0"]["y"] = $y1;

	    $output["point_1"]["id"] = $pointB;
	    $output["point_1"]["x"] = $x2;
	    $output["point_1"]["y"] = $y2;	    

	}

	echo json_encode($output);


    $conn->close();


?>