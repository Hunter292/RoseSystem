<?php
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    switch($method){
        case 'POST':{
            if (!array_key_exists('username', $input) || !array_key_exists('password', $input) || !array_key_exists('pass_admin', $input) ||
            !array_key_exists('email', $input)|| !array_key_exists('admin', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            Auth::check_admin($data);
            Auth::check_admin_pass($input["pass_admin"],$connection,$data["email"]);
            if($input['admin'] && $data["admin"]!=2){
                http_response_code(400);
                echo json_encode(["message" => "Brak wystarczających uprawnień"]);
                exit();
            }
            $query=$connection->prepare("SELECT email FROM pracownik WHERE email=:email");
            $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
            $query->execute();
            if($query->fetch()|| strlen($input["password"])<8){
                http_response_code(422);
                echo json_encode(["message"=>"Email already in use"]);
                exit;
            }
            if($input["admin"]>1)$input["admin"]=1;
            $query=$connection->prepare("INSERT INTO pracownik VALUES(NULL,:name,:email,:password,:admin,current_timestamp())");
            $query->bindValue(":name",$input["username"],PDO::PARAM_STR);
            $query->bindValue(":password",password_hash(hash_hmac("sha256", $input["password"], $_ENV["PEPPER"]),PASSWORD_ARGON2ID),PDO::PARAM_STR);
            $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
            $query->bindValue(":admin",$input["admin"],PDO::PARAM_INT);
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
            if (!array_key_exists('pass_admin', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            if($data["id"]==Router::$route_params["id"]){
                http_response_code(422);
                echo json_encode(["message" => "Nie można usunąć samego siebie"]);
                exit();
            }
            $query=$connection->prepare("SELECT admin FROM pracownik where employee_id=:id");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            $query->execute();
            $ad=$query->fetch();
            if(!$ad ||$ad["admin"]==2|| ($ad["admin"]==1&&$data["admin"]!=2)){
                http_response_code(400);
                echo json_encode(["message" => "Brak wystarczających uprawnień"]);
                exit();
            }
            Auth::check_admin($data);
            Auth::check_admin_pass($input["pass_admin"],$connection,$data["email"]);
            $query=$connection->prepare("DELETE FROM pracownik where employee_id=:id");
            $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
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
            $admin=0;
            //only admins can edit others
            $id=$data["id"];
            
            if(array_key_exists('pass_admin', $input) && array_key_exists('username', $input)){
                Auth::check_admin($data);
                Auth::check_admin_pass($input["pass_admin"],$connection,$data["email"]);
                $id=Router::$route_params["id"];
                //only admins can change usernames
                $name=$input["username"];
                //only super admin can create an admin
                $admin=$data["admin"]==2?$input["admin"]:0;
                //admins cannot downgrade themselfs
                if($id==$data["id"]&& $data["admin"]==2) $admin=2;
                if($id==$data["id"]&& $data["admin"]==1) $admin=1;

                //only super admin can edit admin
                $query=$connection->prepare("SELECT admin FROM pracownik where employee_id=:id");
                $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
                $query->execute();
                $ad=$query->fetch();
                if(($ad["admin"]==1 &&$data["admin"]!=2 &&$data["id"]!=$id)||($ad["admin"]==2&&$data["id"]!=$id &&$data["email"]!="admin@rozowaksiegowa.pl")){
                    http_response_code(400);
                    echo json_encode(["message" => "Brak wystarczających uprawnień"]);
                    exit();
                }
            }elseif(array_key_exists('email', $input)&&array_key_exists('pass', $input)){
                Auth::check_admin_pass($input['pass'],$connection,$data["email"]);
                $name=$data["name"];
            }
            if(isset($name)&&$name){
                $query=$connection->prepare("SELECT email FROM pracownik WHERE email=:email AND employee_id NOT IN(:id)");
                $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
                $query->bindValue(":id",$id,PDO::PARAM_INT);
                $query->execute();
                if($query->fetch()){
                    http_response_code(422);
                    echo json_encode(["message"=>"Email already in use"]);
                    exit;
                }
                $pass="";
                if(array_key_exists('password', $input) && strlen($input['password'])>7) $pass="password=:password,";
                $query=$connection->prepare("UPDATE pracownik SET $pass email=:email,admin=:admin,name=:name WHERE employee_id=:id");
                $query->bindValue(":name",$name,PDO::PARAM_STR);
                $query->bindValue(":email",$input["email"],PDO::PARAM_STR);
                $query->bindValue(":id",$id,PDO::PARAM_INT);
                if($pass)$query->bindValue(":password",password_hash(hash_hmac("sha256", $input["password"], $_ENV["PEPPER"]),PASSWORD_ARGON2ID),PDO::PARAM_STR);
                $query->bindValue(":admin",$admin,PDO::PARAM_INT);
                
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
            else{
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
        }
        case 'GET':{
            if(isset(Router::$route_params["id"])){
                $query=$connection->prepare("SELECT name,email FROM pracownik WHERE employee_id=:id");
                $query->bindValue(":id",Router::$route_params["id"],PDO::PARAM_INT);
            }
            else{
                if($data["admin"]) $query=$connection->query("SELECT name,email,admin,employee_id FROM pracownik ORDER BY name");
                else $query=$connection->query("SELECT name,email,employee_id FROM pracownik ORDER BY name");
            }
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