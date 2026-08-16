<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    switch($method){
        case 'POST':{
            if (!array_key_exists('email', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $query=$connection->prepare("SELECT email_id FROM email_client WHERE email=:email AND client_nip=:nip");
            $query->bindValue(":nip",Router::$route_params["id"],PDO::PARAM_STR);
            $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
            $query->execute();
            if($query->fetch()){
                 http_response_code(422);
                echo json_encode(["message"=> "Email already assigned to client"]);
                exit();
            }
            $query=$connection->prepare("INSERT INTO email_client VALUES(NULL,:nip,:email)");
            $query->bindValue(":nip",Router::$route_params["id"],PDO::PARAM_STR);
            $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
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
        case 'GET':{
            $id=Router::$route_params["id"];
            if(!$id){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }            
            $query=$connection->prepare("SELECT email_id,email FROM email_client WHERE client_nip=:nip");
            $query->bindValue(":nip",$id,PDO::PARAM_STR);
            $query->execute();
            if(!$query){
                http_response_code(500);
                echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                exit();
            }
            http_response_code(200);
            echo json_encode($query->fetchAll());
            exit();
        }
    }
?>