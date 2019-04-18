<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $actor_id = $_POST["actor_id"];
	$session = $_POST["session"];

    $stmt = $conn->prepare("DELETE FROM ACTORS WHERE ACTOR_ID = ? AND SESSION = ?");
    $stmt->bind_param('is', $actor_id, $session);

    $stmt->execute();

    $conn->close();


?>