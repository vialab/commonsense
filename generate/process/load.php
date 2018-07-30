
<?

	include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


	$conn = init_sql();
	$code = $_GET["code"];

	$query = "SELECT * FROM LAYOUTS WHERE CODE = '$code' LIMIT 1";

	$result = $conn->query($query);

    while ($row = $result->fetch_object()){
        $output = $row;
    }


    echo $output->JSON;



	// }


 //    $result->close();

 //    $conn->close();	

?>

