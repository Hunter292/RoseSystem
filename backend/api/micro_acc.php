<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";
    require __DIR__."/../src/verify.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    switch($method){
        case'POST':{
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message" => "Resource not found"]);
                exit();
            }
            if (!array_key_exists('acc_number', $input)|| !array_key_exists('zus', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            Verify::client_nip(Router::$route_params["id"],$connection);
            $query=$connection->prepare("INSERT INTO rachunek VALUES(:acc_number,:id,:zus)");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_STR);
            $query->bindValue(":acc_number",$input["acc_number"],PDO::PARAM_STR);
            $query->bindValue(":zus",$input["zus"],PDO::PARAM_INT);
            Verify::query($query,1);
        }
        case'GET':{
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message" => "Resource not found"]);
                exit();
            }
            $query=$connection->prepare("SELECT acc_number,ZUS FROM rachunek WHERE client_nip=:id");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_STR);
            if(!$query->execute()){
                 http_response_code(500);
                echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                exit();
            }
            http_response_code(200);
             echo json_encode($query->fetchAll());
        exit();
        }  
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }
?>