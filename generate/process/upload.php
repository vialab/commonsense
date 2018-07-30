<?

    // // die();

    // // $content = 'TEST';


    // if (!isset($_POST["data"])) {

    //     // exit();

    // }

    // if (strpos($_POST["data"], "base64,") !== false) {

    //     $content = explode("base64,", $_POST["data"])[1];
    //     $content = base64_decode($content);

    // } else {


    // }


    $content = $_POST["data"];

    if (isset($_POST["upload"])) {

        if (strpos($content, "base64,") !== false) {

            $content = explode("base64,", $content)[1];
            // $content = base64_decode($content);

        }


    } else {

        $content = base64_encode($content);

    }

    $code = $_POST["code"];
    $index = (int)$_POST["index"]+1;

    file_put_contents($_SERVER["DOCUMENT_ROOT"]."/cache/".$code."/".$index, $content);   


    // $name = $_POST["file"];
    // $max = (int)$_POST["max"];
    // $length = (int)strlen($content);

    // include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";

    // $conn = init_sql();

    // // var_dump($_POST);

    // var_dump($code);
    // var_dump($name);
    // var_dump($index);
    // var_dump($length);

    // $stmt = $conn->prepare("INSERT INTO FILES (`CODE`, `NAME`, `INDEX`, `MAX`, `LENGTH`, `CONTENT`) VALUES (?, ?, ?, ?, ?, ?)");
    // $stmt->bind_param('ssiiis', $code, $name, $index, $max, $length, $content);
    // $stmt->execute();

    // echo $code;

    // $conn->close(); 

?>