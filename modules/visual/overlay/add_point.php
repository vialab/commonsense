<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$db_id = $_POST["db"];
	$x = $_POST["x"];
	$y = $_POST["y"];


    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x, $y)");

    $conn->close();


?>