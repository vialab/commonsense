<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$output = array();

	$query = "SELECT * FROM ATTRIBUTE_TYPES ORDER BY ATTRIBUTE_TYPE_ID ASC";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[$row->ATTRIBUTE_TYPE_ID] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>