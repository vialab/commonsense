<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$id = $_POST["db"];
	$length = $_POST["end"] - $_POST["start"];


    $query = "SELECT * FROM ACTORS WHERE ACTOR_ID = $id AND EXT_ID IS NOT NULL";
    $result = $conn->query($query);            

    if ($result->num_rows > 0) {

        while ($row = $result->fetch_object()){
            $item = $row;
        }

        $ext_id = $item->EXT_ID;

    	$query = "SELECT ACTOR_ID FROM ACTORS WHERE META = 'MAIN' AND EXT_ID = '$ext_id'";
	    $result = $conn->query($query);            

        while ($row = $result->fetch_object()){
            $item = $row;
        }

        $actor_id = $item->ACTOR_ID;

        $asset_id = 18391;
		$session = $_POST["session"];
        $meta = "ALL";
    	$name = $_POST["name"];

        $rand = rand(20, 80);
        $rand2 = rand(20, 80);
        $rand3 = rand(20, 80);
        $rand4= rand(20, 80);


        $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?)");
        $stmt->bind_param('isss', $asset_id, $name, $session, $meta);
        $stmt->execute();

        $event_id = $stmt->insert_id;

        $order = $_POST["start"];

	    $stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE, LENGTH) VALUES ('', $actor_id, $event_id, $order, 2, 1, $length)");
	    $stmt->execute();



        echo $actor_id;
        echo "\n";
        echo $name;
        echo "\n";
        echo $session;
        echo "\n";
        echo $meta;
        echo "\n";

    }


?>