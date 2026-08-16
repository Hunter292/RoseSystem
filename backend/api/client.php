<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);

    switch($method){
        case 'POST':{
            Auth::check_admin($data);
            if(!array_key_exists('client_nip', $input) || !array_key_exists('name', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing login credentials"]);
                exit();
            }
            $query=$connection->prepare("INSERT INTO klient VALUES(:nip,:name)");
            $query->bindValue(":name",$input["name"],PDO::PARAM_STR);
            $query->bindValue(":nip",$input["client_nip"],PDO::PARAM_INT);
            $query->execute();
            if(!$query){
                http_response_code(500);
                echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                exit();
            }
            http_response_code(201);
            echo json_encode(["message"=> "Success"]);
            exit();
        }
        case 'PATCH':{
            //Auth::check_admin($data);
            if(!isset(Router::$route_params["id"]) || !array_key_exists('name', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $query=$connection->prepare("UPDATE klient SET name=:name WHERE client_nip=:nip");
            $query->bindValue(":name",$input["name"],PDO::PARAM_STR);
            $query->bindValue(":nip",Router::$route_params["id"],PDO::PARAM_INT);
            $query->execute();
            if(!$query){
                http_response_code(500);
                echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                exit();
            }
            http_response_code(201);
            echo json_encode(["message"=> "Success"]);
            exit();
        }
        case 'GET':{
            $query=$connection->query("SELECT client_nip,name FROM Klient ORDER BY name");
            if(!$query){
                http_response_code(500);
                echo json_encode(["message" => "Something went wrong"]);
                exit();
            }
            http_response_code(200);
            echo json_encode($query->fetchAll());
            exit();
        }
        case "DELETE":{
            Auth::check_admin($data);
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message"=>"Resource doesn't exist"]);
                exit();
            }
            $query=$connection->prepare("DELETE FROM Klient WHERE client_nip=:id");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_STR);
            $query->execute();
            if(!$query){
                http_response_code(500);
                echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                exit();
            }
            http_response_code(200);
            echo json_encode(["message"=> "Success"]);
            exit();
        }
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }
?>