<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$id = $_GET["type"];

	if (isset($_GET["characters"])) {

		$characters = $_GET["characters"];

	} else {

		$characters = array();

	}



	$characters = array_unique($characters);

	if ($id == 3 && count($characters) > 0) {

		$whereArray = array();

		foreach ($characters as $item) {

			$whereArray[] = "CHARACTER_TYPE = '".$item."'";

		}

		$whereArray[] = "CHARACTER_TYPE = ''";

		$where = implode(" OR ", $whereArray);
		$query = "SELECT * FROM ASSETS WHERE ASSET_TYPE_ID = $id AND ($where) ORDER BY ASSET_TYPE_ID, NAME ASC";

	} else {

		$query = "SELECT * FROM ASSETS WHERE ASSET_TYPE_ID = $id ORDER BY ASSET_TYPE_ID, NAME ASC";

	}

	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>