<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$actor = $_POST["db"];

	$query = [];

	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 50, Y = 20 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 50, Y = 30 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 40, Y = 30 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 35, Y = 40 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 30, Y = 50 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 60, Y = 30 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 65, Y = 40 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 70, Y = 50 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 45, Y = 60 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 40, Y = 75 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 35, Y = 90 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 55, Y = 60 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 60, Y = 75 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 65, Y = 90 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 47.5, Y = 10 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 52.5, Y = 10 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 45, Y = 15 WHERE OVERLAY_POINT_ID = #;";
	$query[] = "UPDATE OVERLAY_POINTS SET HIDE = 0, X = 55, Y = 15 WHERE OVERLAY_POINT_ID = #;";

	foreach ($_POST["points"] as $i=>$point) {

		$item = str_replace("#", $point["db"], $query[$i]);

		echo $item;
		echo "\n";
	    $conn->query($item);

	}

    $conn->close();


?>