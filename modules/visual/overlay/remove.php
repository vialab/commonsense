<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$db = $_POST["db"];

	$actor = $_POST["actor"];
	$time = $_POST["time"];

	echo $query = "DELETE FROM INTERACTIONS WHERE TYPE = 4 AND ACTOR_ID_0 = $actor AND (`ORDER` = $time OR `LENGTH` = ".($time - 1).")";
	$result = $conn->query($query);


	$query = "DELETE FROM OVERLAYS WHERE OVERLAY_ID = $db";
	$result = $conn->query($query);


	$query = "DELETE FROM OVERLAY_POINTS WHERE OVERLAY_ID = $db";
	$result = $conn->query($query);


    $conn->close();


?>