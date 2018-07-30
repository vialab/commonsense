<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$direction = $_POST["direction"];
	$id = $_POST["id"];

    $stmt = $conn->prepare("UPDATE INTERACTIONS SET DIRECTION = ? WHERE INTERACTION_ID = ?");
    $stmt->bind_param('ii', $direction, $id);
    $stmt->execute();

    $conn->close();


?>