<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$index = $_POST["index"];
	$db = $_POST["db"];

    $stmt = $conn->prepare("UPDATE INTERACTIONS SET `ORDER` = ? WHERE INTERACTION_ID = ?");
    $stmt->bind_param('di', $index, $db);
    $stmt->execute();

    $conn->close();


?>