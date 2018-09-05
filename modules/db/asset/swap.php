<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();


    $id = $_POST["id"];
	$session = $_POST["session"];
	$db = $_POST["db"];

    $query = "UPDATE ACTORS SET ASSET_ID = $id WHERE ACTOR_ID = $db";
    $result = $conn->query($query);            



    $conn->close();


?>