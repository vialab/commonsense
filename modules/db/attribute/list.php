<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$id = $_POST["id"];

	$query = "SELECT * FROM ATTRIBUTES INNER JOIN ATTRIBUTE_TYPES ON ATTRIBUTE_TYPES.ATTRIBUTE_TYPE_ID = ATTRIBUTES.ATTRIBUTE_TYPE_ID WHERE ACTOR_ID = $id ORDER BY ATTRIBUTE_ID ASC";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[$row->ATTRIBUTE_ID] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>