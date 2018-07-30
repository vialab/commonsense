<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">

    <title>Common Sense</title>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>


  <?

    include $_SERVER["DOCUMENT_ROOT"]."/library/db.php";


    $conn = init_sql();





  ?>



  </head>
  <body>


    <div class="container">

      <div class="row">

        <div class="col-4 offset-4 my-4">

          <h1>Common Sense</h1>

          <h6>Hosted and managed by <a href="mailto:chris.kim@uoit.ca">Chris Kim</a></h6>

          <hr>

          <h2>Generate</h2>

          <p class="lead">

            Create a new visualization, annotation, or user study experience using the web-based interface.

          </p>

          <a href="/generate" target="_blank" class="btn btn-primary btn-sm">Go</a>


          <hr>

          <h2>View</h2>

          <p class="lead">

            Below is the list of recently updated experiences.

          </p>          

          <ul class="list-unstyled">
          <?

              $query = "SELECT * FROM LAYOUTS ORDER BY MODIFIED_DATE DESC LIMIT 10";

              $result = $conn->query($query);

                while ($row = $result->fetch_object()){ ?>

                  <?


                    $date = new DateTime($row->MODIFIED_DATE);
                    $date->setTimezone(new DateTimeZone('America/Toronto'));

                    $json = json_decode($row->JSON);


                  ?>

                  <li>

                      <a href="/view?code=<?= $row->CODE ?>" target="_blank" ><?= $row->CODE ?></a>
                      <a href="/generate?code=<?= $row->CODE ?>" target="_blank"><small><i class="fa fa-pencil-alt"></i></small></a>
                      <small>(Updated: <? echo $date->format('F j, H:i') ?> EST)</small>
                  </li>

          <?
                }


          ?>
          </ul>


        </div>

      </div>

    </div>


  </body>
</html>

<? 
  
      $conn->close();
?>