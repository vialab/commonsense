<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

	$conn = init_sql();
	$code = $_GET["code"];

	$content = "";
	$name = "";

	$query = "SELECT * FROM FILES WHERE CODE = '$code' LIMIT 1";

	$result = $conn->query($query);

    while ($row = $result->fetch_object()){

        $content .= $row->CONTENT;
        $name = $row->NAME;

        $type = $row->TYPE;
        $typeArray = explode("/", $type);
        $extension = $typeArray[1];

        $code = $row->CODE;

        $unique = $code;

        $path = $_SERVER["DOCUMENT_ROOT"]."/assets/".$row->CODE;
        $destination = $_SERVER["DOCUMENT_ROOT"]."/cache/".$unique.".".$extension;
  
        copy($path, $destination);

        if (isset($_GET["path"])) {

            // echo "Fqewf";
            echo "/cache/".$unique.".".$extension;

        } else {

            header('Content-Type: '.$row->TYPE);
            header('Content-Disposition: attachment; filename="'+$code+'.'.$extension.'"');
            header("Location: "."/cache/".$unique.".".$extension);


        }

    }



?>