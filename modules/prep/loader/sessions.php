<?

    include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$md5 = strtoupper(md5($_POST["video"]));


	$query = "SELECT `CODE`, CREATED_DATE FROM LAYOUTS WHERE CODE LIKE '{$md5}_%' ORDER BY LAYOUT_ID DESC";
	$conn = init_sql();
	$results = $conn->query($query);

	$array = array();


	foreach ($results as $item) {

		$date = new DateTime($item["CREATED_DATE"], new DateTimeZone('UTC'));
		$date->setTimezone(new DateTimeZone('America/New_York'));
		$item["CREATED_DATE"] = $date->format('Y-m-d H:i:s');
		$item["SESSION"] = explode("_", $item["CODE"])[1];
		$item["CODE"] = explode("_", $item["CODE"])[0];

		$array[] = $item;

	}


	echo json_encode($array);



?>