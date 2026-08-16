<?php
//use Dotenv\Dotenv;

    require_once __DIR__.'/vendor/autoload.php';
    header("Content-Type: application/json");

    //$dotenv = Dotenv::createImmutable(__DIR__);
    //$dotenv->load();
   
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
    }
?>