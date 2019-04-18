<?


	$root = $_GET["root"];
	$videopath = $root . "/video_clips";

	$list = file_get_contents($videopath);

	echo ($list);

?>