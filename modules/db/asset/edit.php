<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$name = $_POST["name"];
	$id = $_POST["id"];


    $query = "SELECT * FROM ACTORS WHERE ACTOR_ID = $id AND EXT_ID IS NOT NULL";
    $result = $conn->query($query);            

    if ($result->num_rows > 0) {

        while ($row = $result->fetch_object()){
            $item = $row;
        }

        $ext_id = $item->EXT_ID;

	    $stmt = $conn->prepare("UPDATE ACTORS SET NAME = ? WHERE EXT_ID = ?");
	    $stmt->bind_param('ss', $name, $ext_id);
	    $stmt->execute();


    }


    $stmt = $conn->prepare("UPDATE ACTORS SET NAME = ? WHERE ACTOR_ID = ?");
    $stmt->bind_param('si', $name, $id);
    $stmt->execute();

    $conn->close();


?>