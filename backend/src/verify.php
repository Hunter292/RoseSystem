<?php

Class Verify{
    public static function employee_id(string $input,PDO $connection){
        $query=$connection->prepare("SELECT employee_id FROM pracownik WHERE employee_id=:id");
        $query->bindValue(":id",$input,PDO::PARAM_INT);
        $query->execute();
        if(!$query->fetch()) Verify::terminate("Invalid employee");
    }
    public static function employee_ids(array $victims,PDO $connection){
        $sql="SELECT employee_id FROM pracownik WHERE employee_id IN(:id0";
        for($i=1;$i<sizeof($victims);$i++){
            $sql.=",:id$i";
        }
        $query=$connection->prepare($sql.")");
        for($i=0;$i<sizeof($victims);$i++){
            $query->bindValue(":id$i",$victims[$i],PDO::PARAM_INT);
        }
        $query->execute();
        $result=$query->fetchAll();
        if(sizeof($result)!=sizeof($victims)) Verify::terminate("Invalid employee");
    }
    public static function client_nip(string $input,PDO $connection){
        $query=$connection->prepare("SELECT client_nip FROM klient WHERE client_nip=:id");
        $query->bindValue(":id",$input,PDO::PARAM_STR);
        $query->execute();
        if(!$query->fetch()) Verify::terminate("Invalid employee");
    }
    public static function date(string $input){
        if(!DateTime::createFromFormat('Y-m-d', $input)) Verify::terminate("Invalid date");
    }
    public static function task(string $input){
        if(!array_search($input,["Księgowanie faktur","Księgowanie WB","Księgowanie PK","Analizy","Podatki","Wystawianie faktur sprzedaży",
        "Wprowadzanie płatności","Raporty dla klienta","Sprawozdania GUS","Usługi kadrowe","Inne"])) Verify::terminate("Invalid task");
    }
    public static function sanitise_xss(string $input){
        $input=strip_tags($input);
        $input=htmlspecialchars($input);
        return trim($input);
    }
    public static function number($input){
        if(!is_float($input)||!is_integer($input)||!is_double($input)){
            Verify::terminate("Invalid input");
        }
    }
    public static function query(PDOStatement $query,int $mode=0){
        if(!$query->execute()){
            http_response_code(500);
            echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
            exit();
        }
        switch($mode){
            case 1: http_response_code(201); break;
            default: http_response_code(200);
        }
        echo json_encode(["message"=>"Success"]);
        exit();
    }
    static private function terminate(string $message){
        http_response_code(422);
        echo json_encode(["message" => $message]);
        exit();
    }
}
?>