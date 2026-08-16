<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";
    require __DIR__."/../src/verify.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    switch($method){
        case 'POST':{
            if (!array_key_exists('deadline', $input) || !array_key_exists('client_nip', $input) ||
            !array_key_exists('description', $input)|| !array_key_exists('priority', $input)|| !array_key_exists('victims', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            Verify::client_nip($input["client_nip"],$connection);
            if($input["deadline"])Verify::date($input["deadline"]);
            Verify::employee_ids($input["victims"],$connection);
            //Verify::number($input["priority"]);

            //$connection->beginTransaction();
            $error_flag=false;
            $test="";
            $query=$connection->prepare("INSERT INTO zadanie VALUES(NULL,NULL,:deadline,:employee_id,:client_nip,:description,:priority)");
            $query->bindValue(":deadline",$input["deadline"],PDO::PARAM_STR);
            $query->bindValue(":employee_id",$data["id"],PDO::PARAM_INT);
            $query->bindValue(":client_nip",$input["client_nip"],PDO::PARAM_STR);
            $query->bindValue(":description",Verify::sanitise_xss($input["description"]),PDO::PARAM_STR);
            $query->bindValue(":priority",$input["priority"],PDO::PARAM_STR);
            if(!$query->execute()) $error_flag=true;
            if(!$error_flag){
                $test="0";
                $query=$connection->prepare("SELECT task_id FROM zadanie WHERE employee_id=:employee_id ORDER BY task_id DESC LIMIT 1");
                $query->bindValue(":employee_id",$data["id"],PDO::PARAM_INT);
                $query->execute();
                $result=$query->fetch();
                if(!$result) $error_flag=true;
            }
            if(!$error_flag){
                $test="1";
                $id=$result["task_id"];
                $victims=$input["victims"];
                $sql="INSERT INTO task_worker VALUES ($id,:vic0,0)";
                for($i=1;$i<sizeof($victims);$i++){
                    $sql.=",($id,:vic$i,0)";
                }
                $query=$connection->prepare($sql);
                for($i=0;$i<sizeof($victims);$i++){
                    $query->bindValue(":vic$i",$victims[$i],PDO::PARAM_INT);
                }
                if(!$query->execute()) $error_flag=true;
            }
            if($error_flag){
                //$connection->rollBack();
                http_response_code(500);
                echo json_encode(["message"=> $test]);
                exit();
            }
            //$connection->commit();
            http_response_code(201);
            echo json_encode(["message"=>"Success"]);
            exit();
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
                $sql="SELECT task_id,date,deadline,pracownik.name as name,description,klient.name as k_name,priority,client_nip FROM zadanie JOIN pracownik USING(employee_id) JOIN klient USING(client_nip) WHERE employee_id={$data["id"]}";
                $sql.=" AND task_id ".($status==1?'IN':'NOT IN ')."(SELECT DISTINCT task_id FROM task_worker JOIN zadanie USING(task_id) WHERE zadanie.employee_id={$data["id"]} AND status<3)";
            }else{
                $sql="SELECT task_id,date,deadline,pracownik.name as name,description,klient.name as k_name,priority,client_nip FROM zadanie JOIN pracownik USING(employee_id) JOIN klient USING(client_nip) WHERE task_id IN(SELECT DISTINCT task_id FROM task_worker WHERE employee_id={$data["id"]} AND ".($status?"status<3":"status=3").")";
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
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message" => "Resource not found"]);
                exit();
            }
            if (!array_key_exists('deadline', $input) || !array_key_exists('client_nip', $input) ||
            !array_key_exists('description', $input)|| !array_key_exists('priority', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            Verify::client_nip($input["client_nip"],$connection);
            Verify::date($input["deadline"]);
            //Verify::number($input["priority"]);
            $query=$connection->prepare("UPDATE zadanie SET deadline=:deadline, client_nip=:client_nip,description=:description,priority=:priority WHERE task_id=:id");
            $query->bindValue(":deadline",$input["deadline"],PDO::PARAM_STR);
            $query->bindValue(":client_nip",$input["client_nip"],PDO::PARAM_STR);
            $query->bindValue(":description",Verify::sanitise_xss($input["description"]),PDO::PARAM_STR);
            $query->bindValue(":priority",$input["priority"],PDO::PARAM_STR);
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            Verify::query($query);
        }
        case 'DELETE':{
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message" => "Resource not found"]);
                exit();
            }
            $query=$connection->prepare("DELETE FROM zadanie WHERE task_id=:id");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            Verify::query($query);

        }
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }
?>