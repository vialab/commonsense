<?

	$sql_servername = "localhost";
	$sql_username = "aesop";
	$sql_password = "userstudy";
	$sql_dbname = "aesop";

	function init_sql(){

		global $sql_servername;
		global $sql_username;
		global $sql_password;
		global $sql_dbname;

		$dbconn = new mysqli($sql_servername, $sql_username, $sql_password, $sql_dbname);
		$dbconn->set_charset("utf8");

		return $dbconn;

	}

	$conn = init_sql();

	$x = $_POST["x"];
	$y = $_POST["y"];
	$id = $_POST["id"];

    $stmt = $conn->prepare("UPDATE ACTORS SET X = ?, Y = ? WHERE ACTOR_ID = ?");



    $stmt->bind_param('ddi', $x, $y, $id);
    $stmt->execute();

    $conn->close();


?>