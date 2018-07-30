<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$value = $_POST["value"];
	$column = strtoupper($_POST["type"]);
	$id = $_POST["id"];

    $stmt = $conn->prepare("UPDATE ATTRIBUTES SET `$column` = ? WHERE ATTRIBUTE_ID = ?");
    $stmt->bind_param('si', $value, $id);
    $stmt->execute();

    $conn->close();


?>