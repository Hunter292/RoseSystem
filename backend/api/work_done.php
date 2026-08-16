<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    switch($method){
        case 'POST':{
            if (!array_key_exists('client_nip', $input) || !array_key_exists('work_type', $input)||!array_key_exists('date', $input)||
                !array_key_exists('time_start', $input)||!array_key_exists('time_finish', $input)||!array_key_exists('notes', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $query=$connection->prepare("INSERT INTO praca VALUES(NULL,{$data["id"]},:nip,:work_type,:date,:date_start,:date_stop,:notes)");
            $query->bindValue(':nip',$input["client_nip"],PDO::PARAM_STR);
            $query->bindValue(':work_type',$input["work_type"],PDO::PARAM_STR);
            $query->bindValue(':date',$input["date"],PDO::PARAM_STR);
            $query->bindValue(':date_start',$input["time_start"],PDO::PARAM_STR);
            $query->bindValue(':date_stop',$input["time_finish"],PDO::PARAM_STR);
            $query->bindValue(':notes',$input["notes"],PDO::PARAM_STR);
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
        case 'DELETE':{
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message"=>"Resource doesn't exist"]);
                exit();
            }
            $query=$connection->prepare("DELETE FROM praca where work_id=:work_id AND employee_id={$data["id"]}");
            $query->bindValue(":work_id",Router::$route_params["id"],PDO::PARAM_INT);
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
        case 'PATCH':{
            if (!array_key_exists('client_nip', $input) || !array_key_exists('work_type', $input)||!array_key_exists('date', $input)||
                !array_key_exists('time_start', $input)||!array_key_exists('time_finish', $input)||!array_key_exists('notes', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing login credentials"]);
                exit();
            }
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message"=>"Resource doesn't exist"]);
                exit();
            }
            $query=$connection->prepare("UPDATE praca SET client_nip=:nip,work_type=:work_type,date=:date,time_start=:date_start,time_finish=:date_stop,notes=:notes WHERE work_id=:work_id AND employee_id={$data["id"]}");
            $query->bindValue(':nip',$input["client_nip"],PDO::PARAM_STR);
            $query->bindValue(':work_type',$input["work_type"],PDO::PARAM_STR);
            $query->bindValue(':date',$input["date"],PDO::PARAM_STR);
            $query->bindValue(':date_start',$input["time_start"],PDO::PARAM_STR);
            $query->bindValue(':date_stop',$input["time_finish"],PDO::PARAM_STR);
            $query->bindValue(':notes',$input["notes"],PDO::PARAM_STR);
            $query->bindValue(':work_id',Router::$route_params["id"],PDO::PARAM_INT);
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
            $sql="SELECT work_id,name,client_nip,work_type,date,time_start,time_finish,notes FROM praca JOIN Klient USING(client_nip) WHERE employee_id={$data["id"]}";
            if(isset($_GET["id"])&&$_GET["id"]) $sql.=" AND client_nip=:nip";
            if(isset($_GET["date"])&&$_GET["date"]) $sql.=" AND date=:date";
            $sql.=" ORDER BY date DESC,work_id DESC LIMIT 100";
            $query=$connection->prepare($sql);
            if(isset($_GET["id"])&&$_GET["id"]) $query->bindValue(':nip',$_GET["id"],PDO::PARAM_STR);
            if(isset($_GET["date"])&&$_GET["date"]) $query->bindValue(':date',$_GET["date"],PDO::PARAM_STR);

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
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit;
    }
?>