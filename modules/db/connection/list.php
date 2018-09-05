<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();

	$output = array();

	$session = $_GET["session"];

	$query = "SELECT INTERACTION_ID, `ORDER`, A0.NAME AS ACTOR_NAME_0, A1.NAME AS ACTOR_NAME_1, DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, DIRECTION
FROM INTERACTIONS
LEFT JOIN ACTORS A0
ON INTERACTIONS.ACTOR_ID_0 = A0.ACTOR_ID
LEFT JOIN ACTORS A1
ON INTERACTIONS.ACTOR_ID_1 = A1.ACTOR_ID
WHERE TYPE = 3 AND (A0.SESSION = '$session' OR A1.SESSION = '$session')
ORDER BY `ORDER` ASC";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output[(int)$row->ORDER."".$row->INTERACTION_ID] = $row;
    }

    $result->close();

    echo json_encode($output);	

?>