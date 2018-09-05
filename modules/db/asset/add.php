<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();

    $name = $_POST["name"];

    if (isset($_POST["name2"])) {

        $name2 = $_POST["name2"];

    } else {

        $name2 = "(".$_POST["name"].")";

    }

    $id = $_POST["id"];
	$session = $_POST["session"];

    // $stmt = $conn->prepare("INSERT INTO PROPS (NAME, PROP_TYPE, PROP_TYPE_ID) VALUES (?, ?, ?)");
    // $stmt->bind_param('ssi', $name2, $name, $id);
    // $stmt->execute();

    // $prop_id = $stmt->insert_id;


    if (isset($_POST["meta"])) {

        $meta = $_POST["meta"];




        if ($meta == "SCENE" || $meta == "ALL") {

            $tag = null;

            if (isset($_POST["tag"])) {

                $tag = $_POST["tag"];

            }


            $query = "SELECT * FROM ASSETS WHERE ASSET_ID = $id AND ASSET_TYPE_ID = 1";
            $result = $conn->query($query);            

            if ($result->num_rows > 0) {


                $rand = rand(20, 80);
                $rand2 = rand(20, 80);
                $rand3 = rand(20, 80);
                $rand4= rand(20, 80);

                $meta = "MAIN";
                $extid = uniqid();
                $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID, TAG) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?, ?, ?)");
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();

                $tag = NULL;

                $meta = "BODY";
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();

                $meta = "POSE";
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();

                $meta = "FIGURE";
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();

                $meta = "FACE";
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();


                $conn->close();

                die();

            }

            $query = "SELECT * FROM ASSETS WHERE ASSET_ID = $id AND ASSET_TYPE_ID = 2";
            $result = $conn->query($query);            

            if ($result->num_rows > 0) {


                $rand = rand(20, 80);
                $rand2 = rand(20, 80);
                $rand3 = rand(20, 80);
                $rand4= rand(20, 80);

                $meta = "OBJECT";
                $extid = uniqid();
                $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, EXT_ID, TAG) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?, ?, ?)");
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();

                $meta = "OUTLINE";
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();

                $meta = "MAIN";
                $stmt->bind_param('isssss', $id, $name2, $session, $meta, $extid, $tag);
                $stmt->execute();


                $conn->close();

                die();

            }            

        }


        $rand = rand(20, 80);
        $rand2 = rand(20, 80);
        $rand3 = rand(20, 80);
        $rand4= rand(20, 80);

        $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION, META, TAG) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?, ?, ?)");
        $stmt->bind_param('issss', $id, $name2, $session, $meta, $tag);


    } else {

        $rand = rand(20, 80);
        $rand2 = rand(20, 80);
        $rand3 = rand(20, 80);
        $rand4= rand(20, 80);

        $stmt = $conn->prepare("INSERT INTO ACTORS (ASSET_ID, NAME, GRAPH_X, GRAPH_Y, X, Y, Z, RX, RY, RZ, SESSION) VALUES (?, ?, $rand, $rand2, $rand3, $rand4, 0, 0, 0, 0, ?)");
        $stmt->bind_param('iss', $id, $name2, $session);


    }


    $stmt->execute();


    $conn->close();


?>