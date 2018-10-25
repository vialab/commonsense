<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$id = $_POST["id"];

    $query = "SELECT * FROM ACTORS WHERE ACTOR_ID = $id AND EXT_ID IS NOT NULL";
    $result = $conn->query($query);            

    if ($result->num_rows > 0) {

        while ($row = $result->fetch_object()){
            $item = $row;
        }

        $ext_id = $item->EXT_ID;
        $session = $item->SESSION;
        $query = "DELETE FROM ACTORS WHERE EXT_ID = ? AND SESSION = ?";

        var_dump($ext_id);
        var_dump($query);

        $stmt = $conn->prepare($query);
        $stmt->bind_param('ss', $ext_id, $session);
        $stmt->execute();

    }

    $stmt = $conn->prepare("DELETE FROM ACTORS WHERE ACTOR_ID = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();


    $stmt = $conn->prepare("DELETE FROM ATTRIBUTES WHERE ACTOR_ID = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();


    $stmt = $conn->prepare("DELETE FROM INTERACTIONS WHERE ACTOR_ID_0 = ? OR ACTOR_ID_1 = ?");
    $stmt->bind_param('ii', $id, $id);
    $stmt->execute();



    $conn->close();


?>