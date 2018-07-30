<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();


	$characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	$random_string_length = 5;
	$string = '';
	$max = strlen($characters) - 1;
	for ($i = 0; $i < $random_string_length; $i++) {
		$string .= $characters[mt_rand(0, $max)];
	}

	$code = strtoupper($string);

    $stmt = $conn->prepare("INSERT INTO LAYOUTS (CODE) VALUES (?)");
    $stmt->bind_param('s', $code);
    $stmt->execute();

    echo $code;

    $conn->close();	

?>