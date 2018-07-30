<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$id = $_POST["id"];


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