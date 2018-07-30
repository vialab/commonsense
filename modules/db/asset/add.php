<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $name = $_POST["name"];
	$name2 = "(".$_POST["name"].")";
    $id = $_POST["id"];
	$session = $_POST["session"];

    // $stmt = $conn->prepare("INSERT INTO PROPS (NAME, PROP_TYPE, PROP_TYPE_ID) VALUES (?, ?, ?)");
    // $stmt->bind_param('ssi', $name2, $name, $id);
    // $stmt->execute();

    // $prop_id = $stmt->insert_id;


    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION) VALUES (?, ?, 50, 50, 50, 50, 0, 0, 0, 0, ?)");
    $stmt->bind_param('iss', $id, $name2, $session);
    $stmt->execute();


    $conn->close();


?>