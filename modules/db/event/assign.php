<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$column = $_POST["column"];
	$index = $_POST["index"];
	$db = $_POST["db"];

    $stmt = $conn->prepare("UPDATE INTERACTIONS SET $column = ? WHERE INTERACTION_ID = ?");
    $stmt->bind_param('ii', $index, $db);
    $stmt->execute();

    $conn->close();


?>