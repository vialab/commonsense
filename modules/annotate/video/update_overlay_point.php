<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $overlay_point_id = $_POST["overlay_point_id"];
	$x = $_POST["x"];
	$y = $_POST["y"];

    $stmt = $conn->prepare("UPDATE OVERLAY_POINTS SET X = ?, Y = ? WHERE overlay_point_id = ?");
    $stmt->bind_param('ddi', $x, $y, $overlay_point_id);

    $stmt->execute();

    $conn->close();


?>