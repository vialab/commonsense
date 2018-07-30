<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$session = $_GET["session"];

	$query = "SELECT ACTORS.NAME AS ACTOR_NAME, OVERLAYS.*, ACTORS.ACTOR_ID AS ACTOR_ID_ALT FROM ACTORS LEFT JOIN OVERLAYS ON OVERLAYS.ACTOR_ID = ACTORS.ACTOR_ID WHERE ACTORS.SESSION = '$session' ORDER BY ACTORS.ACTOR_ID ASC";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){


        $output[$row->ACTOR_ID_ALT]["data"] = $row;
        $output[$row->ACTOR_ID_ALT]["overlays"][] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>