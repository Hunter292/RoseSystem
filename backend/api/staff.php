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
            //prepare request
            $sql="SELECT work_type,name,email,employee_id, sum(Minute(TIMEDIFF(time_finish,time_start))+Hour(TIMEDIFF(time_finish,time_start))*60)/60 as time
            FROM praca JOIN pracownik USING(employee_id)";
            $get="";
            if($month&&$month2) $get.=" WHERE Month(date) BETWEEN :month AND :month2";
            elseif($month) $get.=" WHERE Month(date)=:month";
            if(!$get&&$year) $get.=" WHERE Year(date)=:year";
            elseif($year)$get.=" AND Year(date)=:year";
            $sql.=$get;
            $sql.=" GROUP BY work_type,email,name,employee_id ORDER BY email,work_type";

            $query=$connection->prepare($sql);
            if($month) $query->bindValue(":month",$month,PDO::PARAM_INT);
            if($month&&$month2) $query->bindValue(":month2",$month2,PDO::PARAM_INT);
            if($year)$query->bindValue(":year",$year,PDO::PARAM_INT);
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