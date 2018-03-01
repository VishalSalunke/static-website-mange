<?php
$link = mysqli_connect('localhost:3306', 'smartia_wp', 'LuxInterior45','smartia_prod');
if (mysqli_connect_error()) {
    die('Connect Error (' . mysqli_connect_errno() . ') '
            . mysqli_connect_error());
}
echo 'Connected successfully';
mysqli_close($link);
?>
