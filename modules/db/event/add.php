<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$order = $_POST["order"];


    $stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, `ORDER`, DIRECTION, TYPE) VALUES ('', $order, 2, 1)");
    $stmt->execute();


    $conn->close();


?>