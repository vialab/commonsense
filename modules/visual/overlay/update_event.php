<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $id = $_POST["db"];
	$session = $_POST["session"];


    $query = "SELECT * FROM ACTORS WHERE ACTOR_ID = $id AND EXT_ID AND SESSION = '$session' IS NOT NULL";
    $result = $conn->query($query);            

    if ($result->num_rows > 0) {

        while ($row = $result->fetch_object()){
            $item = $row;
        }

        $ext_id = $item->EXT_ID;

    	$query = "SELECT ACTOR_ID FROM ACTORS WHERE META = 'MAIN' AND EXT_ID = '$ext_id' AND SESSION = '$session' ";
	    $result = $conn->query($query);            

        while ($row = $result->fetch_object()){
            $item = $row;
        }



        echo $actor_id = $item->ACTOR_ID;
        $event_id = $_POST["event"];

	    $stmt = $conn->prepare("DELETE FROM INTERACTIONS WHERE ACTOR_ID_0 = ? AND ACTOR_ID_1 = ?");
	    $stmt->bind_param('ii', $actor_id, $event_id);
	    $stmt->execute();

        $stmt = $conn->prepare("DELETE FROM INTERACTIONS WHERE ACTOR_ID_0 = ? AND ACTOR_ID_1 = ?");
        $stmt->bind_param('ii', $event_id, $actor_id);
        $stmt->execute();


		$length = $_POST["end"] - $_POST["start"];

	    $order = $_POST["start"];




	    $stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE, LENGTH) VALUES ('', $actor_id, $event_id, $order, 2, 1, $length)");
	    $stmt->execute();

        echo $stmt->insert_id;



    }


    $conn->close();


?>