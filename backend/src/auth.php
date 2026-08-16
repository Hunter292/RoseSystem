<?php
require_once __DIR__."/jwt.php";
class Auth
{
    /**
     * Check whether the JWT token is valid
     * 
     * @return array Data decoded from token, exit if authentication fails
     */
    public static function authenticate_jwt_token(PDO $connection):array
    {
        $authorization = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? null;
        if (!$authorization || !preg_match("/^Bearer\s+(.*)$/", $authorization, $matches)) {
            http_response_code(400);
            echo json_encode(["message" => "incomplete authorization header"]);
            exit();
        }
        try {
            $data = Jwt::decode($matches[1],$connection);
            if(!$data){
                http_response_code(401);
                echo json_encode(["message" => "invalid signature"]);
                exit();
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["message" => $e->getMessage()]);
            exit();
        }
        return $data;
        
    }
    /**
     * Check whether the user is an Admin
     * 
     * @param array $data data from JWT token
     * 
     * @return Void exit if authentication fails
     */
    public static function check_admin(Array $data){
        if(!isset($data["admin"])|| !$data["admin"]){
            http_response_code(403);
            echo json_encode(["message" => "invalid authentication"]);
            exit;
        }
    }
      /**
     * Check if provided admin password is correct for the user
     * 
     * @param string $pass Admin password
     * @param PDO $connection Connection to database
     * @param string $email email of the user
     * 
     * @return Void exit if authentication fails
     */
    public static function check_admin_pass(string $pass,PDO $connection, string $email){
        $query=$connection->prepare("SELECT password FROM pracownik where email=:email");
        $query->bindValue(":email",$email,PDO::PARAM_STR);
        $query->execute();
        $result=$query->fetch();
        if (!$result || !password_verify(hash_hmac("sha256", $pass, getenv("PEPPER")),$result["password"])) {
            http_response_code(403);
            echo json_encode(["message" => "invalid authentication"]);
            exit;
        }
    }
}
?>