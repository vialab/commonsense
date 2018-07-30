<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $text = $_POST["text"];
	$session = $_POST["session"];


    $stmt = $conn->prepare("INSERT INTO MESSAGES (DIRECTION, `TEXT`, `SESSION`) VALUES ('OUT', ?, ?)");
    $stmt->bind_param('ss', $text, $session);
    $stmt->execute();

    $text = strtoupper($text);
    $text2 = "You wrote: [$text]";

    $stmt = $conn->prepare("INSERT INTO MESSAGES (DIRECTION, `TEXT`, `SESSION`) VALUES ('IN', ?, ?)");
    $stmt->bind_param('ss', $text2, $session);
    $stmt->execute();


    $conn->close();


?>