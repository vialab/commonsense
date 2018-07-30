<?


	$data = $_POST["data"];
	$code = $_POST["file"];


	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();


    $stmt = $conn->prepare("UPDATE LAYOUTS SET JSON = ? WHERE CODE = '$code'");
    $stmt->bind_param('s', $data);
    $stmt->execute();


    $stmt = $conn->prepare("INSERT INTO LAYOUT_VERSIONS (CODE, JSON) VALUES (?, ?)");
    $stmt->bind_param('ss', $code, $data);
    $stmt->execute();


    $conn->close();	


    /*
    $path = "/var/www/xai-data.ckprototype.com/specs/".$file;
	file_put_contents($path, $data);




    $folder = "/var/www/xai-data.ckprototype.com/versions/".$file;

	if (!file_exists($folder)) {
	    mkdir($folder, 0777, true);
	}

    $date = date("YmdHis");
    $path2 = $folder."/".$date;
	file_put_contents($path2, $data);

    // echo $path;	
	*/

?>