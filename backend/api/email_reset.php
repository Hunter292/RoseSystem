<?php
    require __DIR__."/../email_sender.php";
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    switch($method){
        case 'POST':{
            if(!array_key_exists('email', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $query=$connection->prepare("SELECT employee_id, name FROM pracownik WHERE email=:email");
            $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
            $query->execute();
            $result=$query->fetch();
            $pin=random_int(100000,999999);
            
            if($result){
                $query=$connection->query("SELECT reset_id FROM zmiana_hasla WHERE employee_id={$result["employee_id"]} AND DATEDIFF(CURRENT_DATE(),date)<2");
                $result2=$query->fetch();
                if($result2){
                    http_response_code(422);
                    echo json_encode(["message" => "Too many reset requests"]);
                    exit();
                }
                http_response_code(202);
                echo json_encode(["message" => "Email sent"]);
                $pin_h=password_hash($pin,PASSWORD_ARGON2ID);
                $query=$connection->prepare("INSERT INTO zmiana_hasla VALUES(NULL,{$result["employee_id"]},$pin_h,NULL,0)");
                $email=email_sender::prepare_email($input["email"],"Kadry@rozowaksiegowa.pl","Kadry","Reset hasła do systemu firmowego");
                $email->Body="
                    <h1>Prośba o zmianę hasła</h1>
                    <p>PIN: $pin</p>
                ";
                $email->send();
                exit();
            }
            http_response_code(202);
            echo json_encode(["message" => "Email sent"]);
            exit();
        }
        case 'PATCH':{
             if(!array_key_exists('email', $input)||!array_key_exists('password', $input)||!array_key_exists('pin', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $error=false;
            if(strlen($input["password"])<8){
                http_response_code(422);
                echo json_encode(["message" => "Password too short"]);
            }
            $query=$connection->prepare("SELECT reset_id,PIN,employee_id FROM zmiana_hasla JOIN pracownik USING(employee_id) WHERE email=:email AND used=0 AND TIMEDIFF(CURRENT_TIMESTAMP,date)<TIMEDIFF(\"10:20:00\",\"10:00:00\")");
            $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
            $query->execute();
            $result=$query->fetch();
            if(!$result) $error=true;
            if(!$error&&!password_verify($input["pin"],$result["PIN"])) $error=true;
            if(!$error){
                $connection->beginTransaction();
                $query=$connection->prepare("UPDATE zmiana_hasla SET used=1 WHERE reset_id={$result["reset_id"]}");
                if(!$query->execute()){
                    $connection->rollBack();
                    http_response_code(500);
                    echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                    exit();
                }
                $query=$connection->prepare("UPDATE pracownik SET password=:pass WHERE employee_id=:{$result["employee_id"]}");
                $query->bindValue(":pass",password_hash(hash_hmac("sha256", $input["password"], $_ENV["PEPPER"]),PASSWORD_ARGON2ID),PDO::PARAM_STR);
                if(!$query->execute()){
                    $connection->rollBack();
                    http_response_code(500);
                    echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                    exit();
                }
                $connection->commit();
                http_response_code(200);
                echo json_encode(["message"=>"Success"]);
                exit();
            }
        }
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }

?>