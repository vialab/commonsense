<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$id = $_POST["id"];


    $stmt = $conn->prepare("DELETE FROM INTERACTIONS WHERE INTERACTION_ID = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();


    $conn->close();


?>