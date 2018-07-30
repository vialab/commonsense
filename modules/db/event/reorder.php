<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$list = $_POST["list"];

	foreach ($list as $id=>$order) {

	    $stmt = $conn->prepare("UPDATE INTERACTIONS SET `ORDER` = ? WHERE INTERACTION_ID = ?");
	    $stmt->bind_param('ii', $order, $id);
	    $stmt->execute();

	}

    $conn->close();


?>