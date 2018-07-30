<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$session = $_POST["session"];


    $stmt = $conn->prepare("DELETE FROM ACTORS WHERE SESSION = ?");
    $stmt->bind_param('s', $session);
    $stmt->execute();


    $stmt = $conn->prepare("DELETE ATTRIBUTES FROM ATTRIBUTES INNER JOIN ACTORS ON ATTRIBUTES.ACTOR_ID = ACTORS.ACTOR_ID WHERE SESSION = ?");
    $stmt->bind_param('s', $session);
    $stmt->execute();


    $stmt = $conn->prepare("DELETE INTERACTIONS FROM INTERACTIONS INNER JOIN ACTORS ON INTERACTIONS.ACTOR_ID_0 = ACTORS.ACTOR_ID WHERE SESSION = ?");
    $stmt->bind_param('s', $session);
    $stmt->execute();



    $stmt = $conn->prepare("DELETE INTERACTIONS FROM INTERACTIONS INNER JOIN ACTORS ON INTERACTIONS.ACTOR_ID_1 = ACTORS.ACTOR_ID WHERE SESSION = ?");
    $stmt->bind_param('s', $session);
    $stmt->execute();



    $stmt = $conn->prepare("DELETE INTERACTIONS FROM INTERACTIONS INNER JOIN ACTORS ON INTERACTIONS.ACTOR_ID_2 = ACTORS.ACTOR_ID WHERE SESSION = ?");
    $stmt->bind_param('s', $session);
    $stmt->execute();


    $stmt = $conn->prepare("DELETE MESSAGES FROM MESSAGES WHERE SESSION = ?");
    $stmt->bind_param('s', $session);
    $stmt->execute();



    $conn->close();


?>