<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $db = $_POST["db"];

    $stmt = $conn->prepare("DELETE FROM FRAMES WHERE FRAME_ID = ?");
    $stmt->bind_param('i', $db);

    $stmt->execute();

    $conn->close();


?>