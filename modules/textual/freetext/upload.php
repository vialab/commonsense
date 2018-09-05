<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $text = $_POST["text"];
	$session = $_POST["session"];
	$meta = "";

    if (isset($_POST["meta"])) {

        $meta = $_POST["meta"];

    }

    $stmt = $conn->prepare("INSERT INTO `TEXT` (SESSION, META, CONTENT) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $session, $meta, $text);
    $stmt->execute();



    $conn->close();


?>