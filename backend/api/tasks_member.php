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
            if (!array_key_exists('employee_id', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            Verify::employee_id($input["employee_id"],$connection);
            $query=$connection->prepare("INSERT INTO task_worker VALUES(:id,:employee_id,0)");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            $query->bindValue(":employee_id",$input["employee_id"],PDO::PARAM_INT);
            Verify::query($query);
        }
        case 'GET':{
            if(!isset($_GET["mode"])||($_GET["mode"]!=1&&$_GET["mode"]!=0)) $mode=0;
            else $mode=$_GET["mode"];
            if(!isset($_GET["status"])||($_GET["status"]!=1&&$_GET["status"]!=0)) $status=1;
            else $status=$_GET["status"];
            $month=NULL;
            if(isset($_GET["month"])&&$_GET["month"]>=1&&$_GET["month"]<13) $month=$_GET["month"];
            $year=NULL;
            if(isset($_GET["year"])) $year=$_GET["year"];
            if($mode){
                $sql="SELECT task_id, status,name,email,task_worker.employee_id FROM task_worker JOIN zadanie USING(task_id) JOIN pracownik ON pracownik.employee_id=task_worker.employee_id WHERE zadanie.employee_id={$data["id"]}";
                $sql.=" AND task_id ".($status==1?'IN':'NOT IN ')."(SELECT DISTINCT task_id FROM task_worker JOIN zadanie USING(task_id) WHERE zadanie.employee_id={$data["id"]} AND status<3)";
            }else{
                $sql="SELECT task_id, status,name,email,task_worker.employee_id FROM task_worker JOIN zadanie USING(task_id) JOIN pracownik ON pracownik.employee_id=task_worker.employee_id WHERE task_id IN(SELECT DISTINCT task_id FROM task_worker WHERE employee_id={$data["id"]} AND ".($status?"status<3":"status=3").")";
            }
            if($month)$sql.=" AND MONTH(date)=:month";
            if($year)$sql.=" AND year(date)=:year";
            $sql.=" ORDER BY task_id ".($status?'ASC':'DESC')." LIMIT 100";
            $query=$connection->prepare($sql);
            if($month) $query->bindValue(":month",$month,PDO::PARAM_INT);
            if($year)$query->bindValue(":year",$year,PDO::PARAM_INT);
            if(!$query->execute()){
                http_response_code(500);
                echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                exit();
            }
            $result=$query->fetchAll();
            http_response_code(200);
            echo json_encode($result);
            exit();
        }
        case 'PATCH':{
            if(!isset(Router::$route_params["id"])||!isset(Router::$route_params["employee"])){
                http_response_code(404);
                echo json_encode(["message" => "Resource not found"]);
                exit();
            }
            if (!array_key_exists('status', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            Verify::employee_id(Router::$route_params["employee"],$connection);
            $status=$input["status"];
            //Verify::number($status);
            if($status>3)$status=3;
            if($status<0)$status=0;
            $query=$connection->prepare("UPDATE task_worker SET status=$status WHERE task_id=:id AND employee_id=:employee_id");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            $query->bindValue(":employee_id",Router::$route_params["employee"],PDO::PARAM_INT);

            Verify::query($query);

        }
        case 'DELETE':{
            if(!isset(Router::$route_params["id"])||!isset(Router::$route_params["employee"])){
                http_response_code(404);
                echo json_encode(["message" => "Resource not found"]);
                exit();
            }
            Verify::employee_id(Router::$route_params["employee"],$connection);
            $query=$connection->prepare("DELETE FROM task_worker WHERE task_id=:id AND employee_id=:employee_id");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            $query->bindValue(":employee_id",Router::$route_params["employee"],PDO::PARAM_INT);
            Verify::query($query);
        }
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }
?>