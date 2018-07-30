<?


    include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

    $code = generate_code();

    mkdir($_SERVER["DOCUMENT_ROOT"]."/cache/".$code);

    echo $code;

    file_put_contents($_SERVER["DOCUMENT_ROOT"]."/assets/".$code, "");

?>