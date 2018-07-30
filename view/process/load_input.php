<?

	session_start();
	$id = session_id();

    $file = $_POST["file"];
    $folder = "/var/www/xai-data.ckprototype.com/input/".$file;

	if (!file_exists($folder)) {
	    mkdir($folder, 0777, true);
	}

    $path = $folder."/".$id;

    if (file_exists($path)){

	    echo file_get_contents($path);

    } else {

	    file_put_contents($path, "");

    }


?>