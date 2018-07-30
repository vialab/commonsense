<?


	
	$code = $_POST["code"];

	$path = $_SERVER["DOCUMENT_ROOT"]."/cache/".$code;
	$files = array_diff(scandir($path), array('.', '..'));

	$type = $_POST["type"];

	natsort($files);

	unlink($_SERVER["DOCUMENT_ROOT"]."/assets/".$code);

	$handle = fopen($_SERVER["DOCUMENT_ROOT"]."/assets/".$code, 'a');


	if ($type == "video/mp4") {

		stream_filter_append($handle, 'convert.base64-decode');

		foreach ($files as $item) {

			$file = $path."/".$item;
			$content = file_get_contents($file);
			$content = trim($content);

			$data = $content;
			fwrite($handle, $data);

			unlink($file);

		}

	} else {

		foreach ($files as $item) {

			$file = $path."/".$item;
			$content = file_get_contents($file);
			$content = trim($content);
			$content = base64_decode($content);

			$data = $content;
			fwrite($handle, $data);

			unlink($file);

		}

	}



	fclose($handle);

    rmdir($path);


	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$name = $_POST["name"];
	$length = filesize($_SERVER["DOCUMENT_ROOT"]."/assets/".$code);

	$stmt = $conn->prepare("INSERT INTO FILES (`CODE`, `NAME`, `TYPE`, `LENGTH`) VALUES (?, ?, ?, ?)");
	$stmt->bind_param('sssi', $code, $name, $type, $length);
	$stmt->execute();

    echo $code;




	// $conn = init_sql();

	// $content = "";
	// $name = "";

	// $query = "SELECT * FROM FILES WHERE CODE = '$code' AND `INDEX` IS NOT NULL ORDER BY `INDEX`";

	// $result = $conn->query($query);

	// $length = 0;

 //    while ($row = $result->fetch_object()){

 //    	// $length = strlen($row->CONTENT);
 //     //    // $content = $row->CONTENT;
 //     //    $name = $row->NAME;

 //     //    // var_dump($row);

 //    }


 //    // if (strpos($content, "base64,") !== false) {

 //    //     $contentArray = explode("base64,", $content);
 //    //     $content = $contentArray[1];
 //    //     $content = base64_decode($content);

 //    //     // var_dump($contentArray);

 //    // }


 //    echo $length;
    // $content = "";

    // echo $content;

 //    $conn->query("SET GLOBAL max_allowed_packet=524288000;");
	// $stmt = $conn->prepare("INSERT INTO FILES (`CODE`, `NAME`, `LENGTH`, `CONTENT`) VALUES (?, ?, ?, ?)");
	// $stmt->bind_param('ssis', $code, $name, $length, $content);
	// $stmt->execute();



?>