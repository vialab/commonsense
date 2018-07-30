<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$output = array();

	$query = "SELECT * FROM ASSETS WHERE ASSET_TYPE_ID = 6 ORDER BY CHARACTER_TYPE ASC, CATEGORY ASC";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>