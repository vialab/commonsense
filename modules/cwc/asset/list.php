<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$session = $_GET["session"];

	$query = "SELECT ACTOR_ID, ACTORS.NAME AS ACTOR_NAME, ACTORS.ASSET_ID, ASSETS.NAME AS ASSET_NAME, ASSET_TYPES.NAME AS ASSET_TYPE_NAME, ASSET_TYPES.ASSET_TYPE_ID AS ASSET_TYPE_ID, RX, RY FROM ACTORS INNER JOIN ASSETS ON ASSETS.ASSET_ID = ACTORS.ASSET_ID INNER JOIN ASSET_TYPES ON ASSET_TYPES.ASSET_TYPE_ID = ASSETS.ASSET_TYPE_ID WHERE ACTORS.SESSION = '$session' ORDER BY ACTOR_ID ASC";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[$row->ACTOR_ID] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>