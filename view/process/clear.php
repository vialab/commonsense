<?

	session_start();
	session_destroy();
	session_start();
	session_regenerate_id(true);

	echo session_id();

?>