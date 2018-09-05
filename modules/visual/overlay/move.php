<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$point = $_POST["db"];
	$x = $_POST["x"];
	$y = $_POST["y"];
	// $type = $_POST["type"];



	echo $query = "UPDATE OVERLAY_POINTS SET X = $x, Y = $y WHERE OVERLAY_POINT_ID = $point";
	$result = $conn->query($query);




    $conn->close();


?>