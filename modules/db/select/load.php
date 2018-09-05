<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$meta = $_GET["meta"];


	$query = "SELECT LAYOUT_ID, CODE FROM LAYOUTS WHERE CODE LIKE '$meta' ORDER BY CODE ASC";


	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[$row->LAYOUT_ID] = $row->CODE;
    }

    $result->close();

    echo json_encode($output);	

?>