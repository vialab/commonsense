<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$session = $_GET["session"];

	$query = "SELECT ACTOR_ID, ACTORS.NAME AS ACTOR_NAME, ACTORS.ASSET_ID, ASSETS.NAME AS ASSET_NAME, ASSET_TYPES.NAME AS ASSET_TYPE_NAME, ASSET_TYPES.ASSET_TYPE_ID AS ASSET_TYPE_ID, RX, RY, ACTORS.META, ACTORS.TAG, ACTORS.GROUP AS ACTOR_GROUP FROM ACTORS INNER JOIN ASSETS ON ASSETS.ASSET_ID = ACTORS.ASSET_ID INNER JOIN ASSET_TYPES ON ASSET_TYPES.ASSET_TYPE_ID = ASSETS.ASSET_TYPE_ID WHERE ACTORS.SESSION = '$session' AND (ACTORS.META = '$meta' OR ACTORS.META = 'MAIN' OR ACTORS.META = 'ALL' OR ACTORS.META = 'SCENE') ORDER BY ACTOR_ID ASC";

	$result = $conn->query($query);

    $actor_id = array();

    while ($row = $result->fetch_object()){

        if ($row->ASSET_NAME == "Generic" && $row->ACTOR_GROUP != null && $_GET["meta"] != "SCENE") {

            continue;

        }

        $output[$row->ACTOR_ID] = $row;
        $output[$row->ACTOR_ID]->BBOX = array();
        $output[$row->ACTOR_ID]->GRAPH = array();
        $actor_id[] = $row->ACTOR_ID;

    }

    $query = "SELECT * FROM OVERLAY_POINTS INNER JOIN OVERLAYS ON OVERLAYS.OVERLAY_ID = OVERLAY_POINTS.OVERLAY_ID WHERE ACTOR_ID IN (".implode(", ", $actor_id).");";
    $result = $conn->query($query);

    while ($row = $result->fetch_object()){

        $output[$row->ACTOR_ID]->BBOX[$row->TIME][] = $row;

    }    


    $query2 = "SELECT * FROM FRAMES WHERE ACTOR_ID IN (".implode(", ", $actor_id).")";
    $result2 = $conn->query($query2);

    while ($row = $result2->fetch_object()){

        $output[$row->ACTOR_ID]->GRAPH[$row->FRAME_NUM] = $row;

    }    



    $result->close();

    echo json_encode($output);	

?>