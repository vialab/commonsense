<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

	$actor = $_POST["db"];
	$time = $_POST["time"];
	// $type = $_POST["type"];



	echo $query = "SELECT OVERLAY_ID FROM OVERLAYS WHERE ACTOR_ID = $actor AND `TIME` LIKE '$time'";
	$result = $conn->query($query);

	if ($result->num_rows == 0) {

	    $stmt = $conn->prepare("INSERT INTO OVERLAYS (ACTOR_ID, `TIME`) VALUES ($actor, $time)");
	    $stmt->execute();

	    $db_id = $stmt->insert_id;

	    if (isset($_POST["x0"])) {

	    	$x0 = $_POST["x0"];
	    	$x1 = $_POST["x1"];
	    	$y0 = $_POST["y0"];
	    	$y1 = $_POST["y1"];

		    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x0, $y0)");
		    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $x1, $y1)");


	    } else {


			if (isset($_POST["meta"]) && $_POST["meta"] == "POSE") {

				if (isset($_POST["preset"])) {

					$preset = json_decode($_POST["preset"]);

					foreach ($preset as $item) {

						$x = $item->x;
						$y = $item->y;
						$hide = $item->hide;

				    	$conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y, HIDE) VALUES ($db_id, $x, $y, $hide)");						

					} 


				} else {


				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 50, 20)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 50, 30)");

				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 40, 30)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 35, 40)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 30, 50)");

				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 60, 30)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 65, 40)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 70, 50)");

				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 45, 60)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 40, 75)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 35, 90)");

				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 55, 60)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 60, 75)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 65, 90)");
				    
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 47.5, 10)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 52.5, 10)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 45, 15)");
				    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, 55, 15)");


				}


			} else {


			    $rand = 25;
			    $rand2 = 75;

			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $rand, $rand)");
			    $conn->query("INSERT INTO OVERLAY_POINTS (OVERLAY_ID, X, Y) VALUES ($db_id, $rand2, $rand2)");

				
			}


	    }



	}



    $conn->close();


?>