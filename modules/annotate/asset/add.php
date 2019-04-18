<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $name = $_POST["name"];
    $id = 18389;
	$session = $_POST["session"];

    $rand = rand(20, 80);
    $rand2 = rand(20, 80);
    $rand3 = rand(20, 80);
    $rand4= rand(20, 80);

    $ext = uniqid();

    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, 'MAIN', '$ext')");
    $stmt->bind_param('iss', $id, $name, $session);

    $stmt->execute();


    $conn->close();


?>