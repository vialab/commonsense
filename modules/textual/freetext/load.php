<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$session = $_GET["session"];
	$meta = $_GET["meta"];

	$query = "SELECT * FROM `TEXT` WHERE SESSION = '$session' AND META = '$meta' ORDER BY `TIMESTAMP` DESC LIMIT 1";
	$result = $conn->query($query);


    while ($row = $result->fetch_object()){
        $output = $row;
    }	

    $conn->close();

    echo json_encode($output);	

?>