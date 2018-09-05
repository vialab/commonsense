<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$db = $_POST["db"];

	$query = "DELETE FROM INTERACTIONS WHERE INTERACTION_ID = $db";
	$result = $conn->query($query);



    $conn->close();


?>