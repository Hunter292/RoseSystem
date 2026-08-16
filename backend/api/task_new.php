<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    switch($method){
        case 'GET':{
            $query=$connection->query("SELECT count(task_id) as count FROM task_worker WHERE status=0 AND employee_id={$data["id"]}");
            $result=$query->fetch();
            http_response_code(200);
            echo $result["count"];
            exit();
        }
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }
?>