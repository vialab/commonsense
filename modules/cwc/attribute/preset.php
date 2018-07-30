<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$output = array();

	$query = "SELECT * FROM ATTRIBUTE_PRESETS ORDER BY ASSET_TYPE_ID, ATTRIBUTE_TYPE_ID, LABEL, `VALUE` ASC";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>