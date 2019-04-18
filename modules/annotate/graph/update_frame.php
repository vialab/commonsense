
<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	
    $stmt = $conn->prepare("UPDATE FRAMES SET X = ?, Y = ?, RZ = ? WHERE FRAME_NUM = ? AND ACTOR_ID = ?");
    $stmt->bind_param('dddii', $_POST["x"], $_POST["y"], $_POST["rz"], $_POST["time"], $_POST["actor"]);
    $stmt->execute();


    $conn->close();


?>

