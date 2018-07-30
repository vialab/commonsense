<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$order = $_POST["order"];
	$actor0 = $_POST["actor0"];
	$actor1 = $_POST["actor1"];
	$type = $_POST["type"];

	if (isset($_POST["direction"])) {

		$direction = $_POST["direction"];

	} else {

		$direction = 2;
	}



    $stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE) VALUES ('', $actor0, $actor1, $order, $direction, $type)");
    $stmt->execute();


    $conn->close();


?>