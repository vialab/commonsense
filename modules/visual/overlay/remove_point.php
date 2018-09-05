<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$db = $_POST["db"];


	$query = "DELETE FROM OVERLAY_POINTS WHERE OVERLAY_POINT_ID = $db";
	$result = $conn->query($query);


    $conn->close();


?>