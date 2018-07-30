<?

	$sql_servername = "localhost";
	$sql_username = "commonsense";
	$sql_password = "84wGfeuQw46Hh7bv";
	$sql_dbname = "commonsense";

	function init_sql(){

		global $sql_servername;
		global $sql_username;
		global $sql_password;
		global $sql_dbname;

		$dbconn = new mysqli($sql_servername, $sql_username, $sql_password, $sql_dbname);
		$dbconn->set_charset("utf8");

		return $dbconn;

	}

	function generate_code(){

	    $characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	    $random_string_length = 5;
	    $string = '';
	    $max = strlen($characters) - 1;
	    for ($i = 0; $i < $random_string_length; $i++) {
	        $string .= $characters[mt_rand(0, $max)];
	    }

	    $code = strtoupper($string);

	    return $code;

	}


?>