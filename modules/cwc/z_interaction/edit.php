<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$name = $_POST["name"];
	$id = $_POST["id"];

    $stmt = $conn->prepare("UPDATE INTERACTIONS SET DESCRIPTION = ? WHERE INTERACTION_ID = ?");
    $stmt->bind_param('si', $name, $id);
    $stmt->execute();

    $conn->close();


?>