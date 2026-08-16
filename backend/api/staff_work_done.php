<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    Auth::check_admin($data);
    switch($method){
        case 'GET':{
            $month=NULL;
            if(isset($_GET["month"])&&$_GET["month"]>=1&&$_GET["month"]<13) $month=$_GET["month"];
            $month2=NULL;
            if(isset($_GET["month2"])&& $_GET["month2"]>=1&&$_GET["month2"]<13) $month2=$_GET["month2"];
            $year=NULL;
            if(isset($_GET["year"])) $year=$_GET["year"];
            $date=NULL;
            if(isset($_GET["date"])) $date=$_GET["date"];
            $client_id=NULL;
            if(isset($_GET["id"])) $client_id=$_GET["id"];
            //prepare request
            $sql="SELECT work_type, name,date,time_start, (Minute(TIMEDIFF(time_finish,time_start))+Hour(TIMEDIFF(time_finish,time_start))*60)/60 as time
            FROM praca LEFT JOIN klient USING(client_nip) WHERE employee_id=:id";
            if($month&&$month2) $sql.=" AND Month(date) BETWEEN :month AND :month2";
            elseif($month) $sql.=" AND Month(date)=:month";
            if($year)$sql.=" AND Year(date)=:year";
            if($date) $sql.=" AND date=:date";
            if($client_id)$sql.=" AND client_nip=:nip";
            $sql.=" ORDER BY name,work_type LIMIT 200";

            $query=$connection->prepare($sql);
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            if($month) $query->bindValue(":month",$month,PDO::PARAM_INT);
            if($month&&$month2) $query->bindValue(":month2",$month2,PDO::PARAM_INT);
            if($year)$query->bindValue(":year",$year,PDO::PARAM_INT);
            if($date) $query->bindValue(":date",$date,PDO::PARAM_STR);
            if($client_id)$query->bindValue(":nip",$client_id,PDO::PARAM_STR);
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
            exit();
    }
?>