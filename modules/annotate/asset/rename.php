<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $actor_id = $_POST["actor_id"];
	$session = $_POST["session"];
	$name = $_POST["name"];

    $stmt = $conn->prepare("UPDATE ACTORS SET NAME = ? WHERE ACTOR_ID = ? AND SESSION = ?");
    $stmt->bind_param('sis', $name, $actor_id, $session);

    $stmt->execute();

    $conn->close();


?>