<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$type_id = $_POST["type_id"];
	$asset_id = $_POST["actor_id"];

	if (isset($_POST["label"]) && isset($_POST["value"])) {




		if (isset($_POST["attachment_id"])) {

			$att_id = $_POST["attachment_id"];


			$label = $_POST["label"];
			$value = $_POST["value"];

	    	$stmt = $conn->prepare("INSERT INTO ATTRIBUTES (ACTOR_ID, LABEL, VALUE, ATTRIBUTE_TYPE_ID, META) VALUES (?, ?, ?, ?, ?)");
		    $stmt->bind_param('issii', $asset_id, $label, $value, $type_id, $att_id);

	    	$stmt->execute();

		    $name = $value;
			$name2 = "(".$value.")";			

		    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RZ) VALUES (?, ?, 50, 50, 50, 50, 0, 0)");
		    $stmt->bind_param('is', $att_id, $name2);
		    $stmt->execute();
			$attachment_id = $stmt->insert_id;


			$order = -1;
			$actor0 = $asset_id;
			$actor1 = $attachment_id;
			$type = 3;

		    $stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE) VALUES ('', $actor0, $actor1, $order, 2, $type)");
		    $stmt->execute();			


	    } else {


			$label = $_POST["label"];
			$value = $_POST["value"];

	    	$stmt = $conn->prepare("INSERT INTO ATTRIBUTES (ACTOR_ID, LABEL, VALUE, ATTRIBUTE_TYPE_ID) VALUES (?, ?, ?, ?)");
		    $stmt->bind_param('issi', $asset_id, $label, $value, $type_id);

	    	$stmt->execute();

	    }

	} else {


	    $stmt = $conn->prepare("INSERT INTO ATTRIBUTES (ACTOR_ID, LABEL, ATTRIBUTE_TYPE_ID) VALUES (?, '', ?)");
	    $stmt->bind_param('ii', $asset_id, $type_id);

    	$stmt->execute();

	}

    $conn->close();


?>