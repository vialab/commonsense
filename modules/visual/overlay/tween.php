<?


	// curl 'http://commonsense.ckprototype.com/modules/visual/overlay/tween.php' -H 'Origin: http://commonsense.ckprototype.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-CA,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,en-GB;q=0.6,en-US;q=0.5,la;q=0.4,fr;q=0.3' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: */*' -H 'Referer: http://commonsense.ckprototype.com/view/?code=DEMOMGVIDEO&session=UPLOAD&page=2' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' --data 'db=2524&start=348&end=728&startX0=73.4835&startY0=25.8506&startX1=93.4295&startY1=71.6968&endX0=36.5256&endY0=11.7523&endX1=42.1474&endY1=24.6742' --compressed


	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();


	$frame = 0;
	$actor = $_POST["db"];
	$order = $_POST["start"];
	$length = $_POST["end"] - $_POST["start"];





    $query = "SELECT * FROM INTERACTIONS WHERE ACTOR_ID_0 = $actor AND TYPE = 4 AND `ORDER` = $order AND LENGTH = $length";
    $result = $conn->query($query);            

    if ($result->num_rows == 0) {


    	$stmt = $conn->prepare("INSERT INTO INTERACTIONS (DESCRIPTION, ACTOR_ID_0, ACTOR_ID_1, `ORDER`, DIRECTION, TYPE, LENGTH) VALUES ('', $actor, null, $order, 2, 4, $length)");
	    $stmt->execute();


    }

	// for ($i = $_POST["start"]+1; $i < $_POST["end"]; $i++) {

	// 	$frame++;



	// 	$xm0 = $_POST["startX0"] + (($_POST["endX0"] - $_POST["startX0"]) * ($frame / $range));
	// 	$ym0 = $_POST["startY0"] + (($_POST["endY0"] - $_POST["startY0"]) * ($frame / $range));

	// 	$xm1 = $_POST["startX1"] + (($_POST["endX1"] - $_POST["startX1"]) * ($frame / $range));
	// 	$ym1 = $_POST["startY1"] + (($_POST["endY1"] - $_POST["startY1"]) * ($frame / $range));



	// 	echo $actor;
	// 	echo "\n";
	// 	echo $i;
	// 	echo "\n";		
	// 	echo $xm0.",".$ym0;
	// 	echo "\n";
	// 	echo $xm1.",".$ym1;
	// 	echo "\n";


	//     $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $i)");
	//     $stmt->execute();

	//     $db_id = $stmt->insert_id;

	// 	echo "\n";
	// 	echo "\n";
	//     echo "DB".$db_id;

	// 	$query0 = "INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $xm0, $ym0)";
	// 	$query1 = "INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $xm1, $ym1)";

	// 	$stmt = $conn->query($query0);
	// 	$stmt = $conn->query($query1);

	// 	// echo $query0;
	// 	// echo "\n";
	// 	// echo $query1;
	// 	// echo "\n";




	// }


    $conn->close();

?>