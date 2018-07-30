<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$actor = $_POST["db"];
	$time = $_POST["time"];



	$query = "SELECT OVERLAY_ID FROM OVERLAYS WHERE ACTOR_ID = $actor AND `TIME` LIKE '$time%'";
	$result = $conn->query($query);

	if ($result->num_rows == 0) {

	    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`, X, Y, W, H) VALUES ($actor, $time, 25, 25, 50, 50)");
	    $stmt->execute();

	}



    $conn->close();


?>