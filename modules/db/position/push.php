<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$id = $_POST["id"];

	if (isset($_POST["z"])) {

		$x = $_POST["x"];
		$z = $_POST["z"];

	    $stmt = $conn->prepare("UPDATE ACTORS SET X = ?, Z = ? WHERE ACTOR_ID = ?");
	    $stmt->bind_param('ddi', $x, $z, $id);

	} else if (isset($_POST["rz"])) {

		$rz = (float)$_POST["rz"];

		if ($rz < 0) { // BETWEEN -270 and 0

			$rz += 360;

		}

	    $stmt = $conn->prepare("UPDATE ACTORS SET RZ = ? WHERE ACTOR_ID = ?");
	    $stmt->bind_param('di', $rz, $id);

	} else {

		$x = $_POST["x"];
		$y = $_POST["y"];

	    $stmt = $conn->prepare("UPDATE ACTORS SET X = ?, Y = ? WHERE ACTOR_ID = ?");
	    $stmt->bind_param('ddi', $x, $y, $id);

	}




    $stmt->execute();

    $conn->close();


?>