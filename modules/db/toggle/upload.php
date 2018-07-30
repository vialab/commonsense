<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$url = $_POST["url"];

	$data = file_get_contents($url);
	$json = json_decode($data);



    $stmt = $conn->prepare("DELETE FROM INTERACTIONS WHERE 1 = 1");
    $stmt->execute();


    $stmt = $conn->prepare("DELETE FROM ACTORS WHERE 1 = 1");
    $stmt->execute();


    $stmt = $conn->prepare("DELETE FROM ATTRIBUTES WHERE 1 = 1");
    $stmt->execute();


	foreach ($json->nodes as $item) {

		if ($item->type == "entity") {

			$id = 1500;
			$name2 = $item->name;

		    $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, X, Y) VALUES (?, ?, 50, 50)");
		    $stmt->bind_param('is', $id, $name2);
		    $stmt->execute();

		}


	}



    $conn->close();


?>