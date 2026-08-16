<?php
   require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    Auth::check_admin($data);

    switch($method){
        case 'POST':{
            //add individual income
            if(isset($_GET["mode"])&& $_GET["mode"]==1){
                if(!array_key_exists('client_nip', $input)||!array_key_exists('amount', $input)||!array_key_exists('date', $input)){
                    http_response_code(400);
                    echo json_encode(["message" => "Missing data"]);
                    exit();
                }
                $query=$connection->prepare("INSERT INTO faktura VALUES(NULL,:nip,:amount,:date)");
                $query->bindValue(":nip",$input["client_nip"],PDO::PARAM_STR);
                $query->bindValue(":amount",$input["amount"],PDO::PARAM_STR);
                $query->bindValue(":date",$input["date"],PDO::PARAM_STR);
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
            if (!array_key_exists('data', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $input=$input['data'];
            if(!array_key_exists('NIP', $input[0])||!array_key_exists('Kontrahent', $input[0])){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            //find clients not in the database and add them
            $query=$connection->query("SELECT client_nip FROM klient");
            $result=$query->fetchAll();
            $sql="INSERT INTO Klient VALUES(:nip0,:name0)";
            $insert_nips=[];
            $new_nip_flag=true;
            foreach($input as $row){
                $new_nip_flag=true;
                foreach($result as $nip){
                    if($row["NIP"]==$nip["client_nip"]){
                        $new_nip_flag=false;
                        break;
                    }
                }
                if($new_nip_flag){
                    array_push($insert_nips,$row);
                    array_push($result,["client_nip"=>$row["NIP"]]);
                }
            }
            if($insert_nips){
                for($i=1;$i<sizeof($insert_nips);$i++)$sql.=",(:nip$i,:name$i)";
                $query=$connection->prepare($sql);
                for($i=0;$i<sizeof($insert_nips);$i++){
                    $query->bindValue(":nip$i",$insert_nips[$i]["NIP"],PDO::PARAM_STR);
                    $query->bindValue(":name$i",$insert_nips[$i]["Kontrahent"],PDO::PARAM_STR);
                }
                $query->execute();
                if(!$query){
                    http_response_code(500);
                    echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
                    exit();
                }
            }
            //mode==2 means insert only clients
            if(isset($_GET["mode"])&& $_GET["mode"]==2){
                http_response_code(201);
                echo json_encode(["message"=> "Success"]);
                exit();
            }
            if(!array_key_exists('Netto', $input[0])||!array_key_exists('Data wyst.', $input[0])){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $sql="INSERT INTO faktura VALUES(NULL,:nip0,:amount0,:date0)";
            for($i=1;$i<sizeof($input);$i++){
                $sql.=",(NULL,:nip$i,:amount$i,:date$i)";
            }
            $query=$connection->prepare($sql);
            for($i=0;$i<sizeof($input);$i++){
                $query->bindValue(":nip$i",$input[$i]["NIP"],PDO::PARAM_STR);
                $query->bindValue(":amount$i",(float)$input[$i]["Netto"],PDO::PARAM_INT);
                $query->bindValue(":date$i",$input[$i]["Data wyst."],PDO::PARAM_INT);
            }
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
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message"=>"Resource doesn't exist"]);
                exit();
            }
            if(!array_key_exists('client_nip', $input)||!array_key_exists('amount', $input)||!array_key_exists('date', $input)){
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $query=$connection->prepare("UPDATE faktura SET client_nip=:nip,amount=:amount,date=:date WHERE faktura_id=:faktura_id");
            $query->bindValue(":nip",$input["client_nip"],PDO::PARAM_STR);
            $query->bindValue(":amount",$input["amount"],PDO::PARAM_INT);
            $query->bindValue(":date",$input["date"],PDO::PARAM_STR);
            $query->bindValue(":faktura_id",Router::$route_params["id"],PDO::PARAM_INT);
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
            //it's either month/year or client in GET
            $month=NULL;
            if(isset($_GET["month"])&& $_GET["month"]>=1&&$_GET["month"]<13) $month=$_GET["month"];
            $month2=NULL;
            if(isset($_GET["month2"])&& $_GET["month2"]>=1&&$_GET["month2"]<13) $month2=$_GET["month2"];
            $year=NULL;
            if(isset($_GET["year"])) $year=$_GET["year"];
            $client=NULL;
            if(isset($_GET["client"])) $client=$_GET["client"];
            //prepare request
            $sql="SELECT faktura_id, client_nip,name, amount,date FROM faktura JOIN klient using(client_nip)";
            $get="";
            if($month&&$month2) $get.=" WHERE Month(date) BETWEEN:month AND :month2";
            elseif($month) $get.=" WHERE Month(date)=:month";
            if(!$get&&$year) $get.=" WHERE Year(date)=:year";
            elseif($year)$get.=" AND Year(date)=:year";
            if($client)$get.=" WHERE client_nip=:nip";
            $sql.=$get;
            $sql.=" ORDER BY name LIMIT 100";

            $query=$connection->prepare($sql);
            if($month) $query->bindValue(":month",$month,PDO::PARAM_INT);
            if($month&&$month2) $query->bindValue(":month2",$month2,PDO::PARAM_INT);

            if($year)$query->bindValue(":year",$year,PDO::PARAM_INT);
            if($client)$query->bindValue(":nip",$client,PDO::PARAM_STR);
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
        case 'DELETE':{
            if(!isset(Router::$route_params["id"])){
                http_response_code(404);
                echo json_encode(["message"=>"Resource doesn't exist"]);
                exit();
            }
            $query=$connection->prepare("DELETE FROM faktura WHERE faktura_id=:faktura_id");
            $query->bindValue(":faktura_id",Router::$route_params["id"],PDO::PARAM_INT);
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
    }

?>