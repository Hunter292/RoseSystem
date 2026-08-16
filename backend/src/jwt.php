<?php
class Jwt{
    /**
     * Encodes provided data into JWT Token
     * 
     * @param array $payload Payload for creating the token
     * 
     * @return string Created Token
     */
    public static function encode(array $payload): string
    {
        $header = json_encode([
            "alg" => "HS256",
            "typ" => "JWT"
        ]);

        $header = Jwt::base64URLEncode($header);
        $payload = json_encode($payload);
        $payload = Jwt::base64URLEncode($payload);

        $signature = hash_hmac("sha256", $header . "." . $payload, $_ENV["SECRET_KEY"], true);
        $signature = Jwt::base64URLEncode($signature);
        return $header . "." . $payload . "." . $signature;
    }
    /**
     * Decodes JWT Token into data
     * 
     * @param string $token JWT Token
     * 
     * @return mixed Data on success, 0 for invalid or expired token
     */
    public static function decode(string $token, PDO $connection)
    {
        if (
            preg_match(
                "/^(?<header>.+)\.(?<payload>.+)\.(?<signature>.+)$/",
                $token,
                $matches
            ) !== 1
        ) {
            //throw new InvalidArgumentException("invalid token format");
            return 0;
        }
        $signature = hash_hmac(
            "sha256",
            $matches["header"] . "." . $matches["payload"],
            $_ENV["SECRET_KEY"],
            true
        );
        $signature_from_token = Jwt::base64URLDecode($matches["signature"]);
        if (!hash_equals($signature, $signature_from_token)) {

            // throw new Exception("signature doesn't match");
            return 0;
            
        }
        $payload = json_decode(Jwt::base64URLDecode($matches["payload"]), true);
        $date=new DateTime($payload["time"]);
        $interval = DateInterval::createFromDateString('8 hour');
        $query=$connection->query("SELECT updated FROM pracownik WHERE employee_id={$payload["id"]}");
        $result=$query->fetch();
        if($date<new DateTime($result["updated"])) return 0;
        if(date_add($date,$interval)<new DateTime('NOW')) return 0;
        return $payload;
    }
    private static function base64URLEncode(string $text): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }
    private static function base64URLDecode(string $text): string
    {
        return base64_decode(
            str_replace(
                ["-", "_"],
                ["+", "/"],
                $text
            )
        );
    }


}
?>