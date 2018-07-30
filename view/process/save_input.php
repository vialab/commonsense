<?

	session_start();
	$id = session_id();

    $file = $_POST["file"];
    $folder = "/var/www/xai-data.ckprototype.com/input/".$file;

	if (!file_exists($folder)) {
	    mkdir($folder, 0777, true);
	}

	$data = $_POST["data"];
    $path = $folder."/".$id;

    file_put_contents($path, $data);




    $folder = "/var/www/xai-data.ckprototype.com/versions/".$id;

	if (!file_exists($folder)) {
	    mkdir($folder, 0777, true);
	}

    $date = date("YmdHis");
    $path2 = $folder."/".$date;
	file_put_contents($path2, $data);

?>