<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/jwt.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid JSON data"]);
        exit();
    }
    switch($method){
        case 'POST':{
            if (!array_key_exists('email', $input) || !array_key_exists('password', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing login credentials"]);
                exit();
            }
            $query=$connection->prepare("SELECT password,employee_id,admin,name from pracownik where email=:email");
            $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
            $query->execute();
            $result=$query->fetch();
            if (!$result || !password_verify(hash_hmac("sha256", $input["password"], $_ENV["PEPPER"]),$result["password"])){
                http_response_code(401);
                echo json_encode(["message" => "invalid authentication"]);
                exit;
            }
            $payload = [
                "id" => $result['employee_id'],
                "email" => $input["email"],
                "name"=> $result["name"],
                "admin"=> $result["admin"],
                "time"=> date("Y-m-d H:i:s")
            ];
            $token =Jwt::encode($payload);
            http_response_code(200);
            echo json_encode(["token" => $token]);
            exit();
        }
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }
?>