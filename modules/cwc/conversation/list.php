<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$session = $_GET["session"];

	$query = "SELECT * FROM MESSAGES WHERE `SESSION` = '$session'";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[$row->MESSAGE_ID] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>