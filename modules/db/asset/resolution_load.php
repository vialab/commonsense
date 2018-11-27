<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();


	$resolution_name = json_encode($_GET["resolution_name"]);
	$resolution_name = str_replace("'", "\'", $resolution_name);

	$query = "SELECT * FROM RESOLUTIONS WHERE NAMES = '$resolution_name' ORDER BY RESOLUTION_ID DESC";
	$result = $conn->query($query);

	$output = array();

    while ($row = $result->fetch_object()){
        $output[] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>