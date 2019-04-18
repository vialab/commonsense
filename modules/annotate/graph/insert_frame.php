
<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	
    $stmt = $conn->prepare("INSERT FRAMES (X, Y, RZ, FRAME_NUM, ACTOR_ID) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('dddii', $_POST["x"], $_POST["y"], $_POST["rz"], $_POST["time"], $_POST["actor"]);
    $stmt->execute();

    echo $db_id = $stmt->insert_id;

    $conn->close();


?>

