<?php
$host=getenv('DB_HOST');
$user=getenv('DB_USERNAME');
$pass=getenv('DB_PASSWORD');
$db=getenv('DB_DATABASE');

try{
    //$connection= new PDO("mysql:host={$_ENV["DB_HOST"]};dbname={$_ENV["DB_NAME"]};charset=utf8",$_ENV["DB_USER"],$_ENV["DB_PASS"],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
    //PDO::ATTR_EMULATE_PREPARES=>FALSE,PDO::ATTR_STRINGIFY_FETCHES=>false]);
    $connection= new PDO("mysql:host={$host};dbname={$db};charset=utf8",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES=>FALSE,PDO::ATTR_STRINGIFY_FETCHES=>false]);
}
catch(PDOException $e){
    exit('Bład servera');
}