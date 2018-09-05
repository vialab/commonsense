<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$db = $_POST["db"];
	$hide = $_POST["hide"];

	$query = "UPDATE OVERLAY_POINTS SET HIDE = $hide WHERE OVERLAY_POINT_ID = $db";
	$result = $conn->query($query);

    $conn->close();

?>