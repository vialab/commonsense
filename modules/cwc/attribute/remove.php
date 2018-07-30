<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$id = $_POST["id"];




	$query = "SELECT * FROM ATTRIBUTES WHERE ATTRIBUTE_ID = $id";
	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $data = $row;
    }

    $actor = $data->ACTOR_ID;
    $meta = $data->META;


    $stmt = $conn->prepare("DELETE FROM ATTRIBUTES WHERE ATTRIBUTE_ID = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();



    if ($meta != "") {

    	$interactRemoval = array();
    	$actorRemoval = array();

		$query = "SELECT INTERACTION_ID, ACTOR_ID_1 FROM INTERACTIONS INNER JOIN ACTORS ON ACTOR_ID_1 = ACTORS.ACTOR_ID WHERE ACTOR_ID_0 = $actor AND TYPE = 3 AND ACTORS.ASSET_ID = $meta";
		$result = $conn->query($query);

	    while ($row = $result->fetch_object()){
	        $actorRemoval[$row->ACTOR_ID_1] = $row;
	        $interactRemoval[$row->INTERACTION_ID] = $row;
	    }

	    var_dump($actorRemoval);
	    var_dump($interactRemoval);

	    foreach ($interactRemoval as $id => $row) {

		    $stmt = $conn->prepare("DELETE FROM INTERACTIONS WHERE INTERACTION_ID = ?");
		    $stmt->bind_param('i', $id);
		    $stmt->execute();		    	

	    }

	    foreach ($actorRemoval as $id => $row) {

		    $stmt = $conn->prepare("DELETE FROM ACTORS WHERE ACTOR_ID = ?");
		    $stmt->bind_param('i', $id);
		    $stmt->execute();		    	

	    }

    }



    $conn->close();


?>