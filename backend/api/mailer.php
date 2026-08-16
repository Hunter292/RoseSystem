<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;
    require __DIR__."/../bootstrap.php";
    require __DIR__."/../src/db_connect.php";
    require __DIR__."/../src/auth.php";
    require __DIR__."/../src/email_sender.php";
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $data=Auth::authenticate_jwt_token($connection);
    switch($method){
        case 'POST':{
            if (!array_key_exists('client_nip', $input) || !array_key_exists('taxes', $input) || !array_key_exists('taxes_v', $input)
            || !array_key_exists('taxes_m', $input)|| !array_key_exists('notes', $input)
            || !array_key_exists('emails', $input) || !array_key_exists('date', $input)) {
                http_response_code(400);
                echo json_encode(["message" => "Missing data"]);
                exit();
            }
            $emails=$input["emails"];
            $content="";
            for($i=0;$i<sizeof($input["taxes"]);$i++){
                $content.=$input["taxes"][$i]." - ".$input["taxes_v"][$i]." zł termin płatności:".$input["taxes_m"][$i];
                //if($input["taxes_acc"][$i]) $content.=" rachunek: ".$input["taxes_acc"][$i];
                //if($input["taxes_m"][$i]) $content.=" okres: ".$input["taxes_m"][$i];
                $content.=";";
            }
            $error_flag=false;
            $connection->beginTransaction();
                $query=$connection->prepare("INSERT INTO raport VALUES(NULL,{$data["id"]},:nip,CURDATE(),:content,:notes)");
                $query->bindValue(":nip",$input["client_nip"],PDO::PARAM_STR);
                $query->bindValue(":content",$content,PDO::PARAM_STR);
                $query->bindValue(":notes",$input["notes"],PDO::PARAM_STR);
                
                $query->execute();
                if(!$query)$error_flag=true;
                $report_id=0;
                if(!$error_flag){
                    $query=$connection->prepare("SELECT report_id FROM raport WHERE date=CURDATE() AND employee_id={$data["id"]} AND client_nip=:nip ORDER BY report_id desc LIMIT 1");
                    $query->bindValue(":nip",$input["client_nip"],PDO::PARAM_STR);
                    $query->execute();
                    if(!$query) $error_flag=true;
                    else{
                        $report_id=$query->fetch();
                        $report_id=$report_id["report_id"];
                        if(!$report_id) $error_flag=true;
                    }
                }
                if(!$error_flag){
                    
                    $sql="INSERT INTO email_report VALUES ($report_id,:email0)";
                    for($i=1;$i<sizeof($emails);$i++){
                        $sql.=" ,($report_id,:email$i)";
                    }
                    $query=$connection->prepare($sql);
                    for($i=0;$i<sizeof($emails);$i++){
                        $query->bindValue(":email$i",$emails[$i],PDO::PARAM_INT);
                    }
                    $query->execute();
                    if(!$query)$error_flag=true;
                }
                if(!$error_flag){
                    //get emails from ids
                    $ids=$emails[0];
                    for($i=1;$i<sizeof($emails);$i++) $ids.=','.$emails[$i];
                    $query=$connection->prepare("SELECT email FROM email_client WHERE email_id IN($ids)");
                    //$query->bindValue(":ids",$ids,PDO::PARAM_STR);
                    $query->execute();
                    $results=$query->fetchAll();
                    $emails=[];
                    if(!sizeof($results)) $error_flag=true;
                    else{
                        foreach($results as $result) array_push($emails,$result["email"]);
                    }
                    
                }
                if(!$error_flag){
                    //send emails
                    try{
                    //$mail=email_sender::prepare_email($emails,$data["email"],$data["name"],"Rozliczenei podatkowe - Różowa Księgowa");
                    $mail=new PHPMailer(true);
                    //$mail->SMTPDebug = 2;

                    $mail->isSMTP();
                    //$mail->Host='smtp.rozowaksiegowa.pl';
                    $mail->Host='smtp.gmail.com';
                    $mail->Port=465;
                    //$mail->SMTPSecure='tls';
                    $mail->SMTPAuth=true;
                    $mail->Username='kacper05112004@gmail.com';
                    //$mail->Username='biuro@rozowaksiegowa.pl';
                    $mail->Password='ihgjqqcqvpdyaiia';
                    $mail->CharSet='UTF-8';
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                    $mail->setFrom("kacper05112004@gmail.com",$data["name"]);
                    //foreach($emails as $email) $mail->addAddress($email);
                    $mail->addAddress("kacper05112004@gmail.com");
                    $mail->addAddress("kacpercwiek@tutamail.com");
                    //$mail->addReplyTo('biuro@rozowaksiegowa.pl','Biuro');
                    $mail->addReplyTo($data["email"]);

                    $mail->isHTML(true);
                    $mail->Subject="Podatki za ".$input["date"];
                    $text="<ul>";
                    for($i=0;$i<sizeof($input["taxes"]);$i++){
                        $text.="<li style=\"display: flex; margin-bottom: 5px;\"><p style=\"width: 50px;\">{$input["taxes"][$i]}</p><p> - {$input["taxes_v"][$i]} zł, termin płatności: {$input["taxes_m"][$i]}</p>";
                        //if($input["taxes_acc"][$i]) $text.="<p> rachunek: ".$input["taxes_acc"][$i]."</p>";
                        //if($input["taxes_m"][$i]) $text.="<p> okres: ".$input["taxes_m"][$i]."</p>";
                        $text.="</li>";
                    }
                    $text.="</ul>";
                    $mail->Body="
                    <html>
                        <body style=\"background-color: #FDF2F2;\">
                            <div style=\"background-color: white; margin: 20px; padding: 10px 30px 10px 30px;\">
                                <p>Dzień dobry,</p>
                                </br>
                                <p>Informujemy, że zostały przygotowane rozliczenia za {$input["date"]}</p>
                                <p>Do zapłaty pozostają następujące podatki:</p>
                                $text
                                <p>Płatności należy dokonać na właściwy rachunek podatkowy. </p>
                                <p>Prosimy o terminowe uregulowanie należności.</p>
                                <p>{$input["notes"]}</p>
                                <br>
                                <p>W razie pytań pozostajemy do dyspozycji.</p>
                                <br>
                                <p>Pozdrawiamy,</p>
                                <p>Zespół Różowej Księgowej</p>
                            </div>
                        </body>
                    </html>
                    ";
                    if (!$mail->send()) {
                        throw new Exception($mail->ErrorInfo);
                    }
                    }catch(Exception $e){
                        http_response_code(500);
                        echo json_encode(["messsage"=>$mail->ErrorInfo]);
                        $connection->rollBack();
                        exit();
                    }
                }
            if(!$error_flag){
                    $connection->commit();
                    http_response_code(200);
                    echo json_encode(["message"=>"Success"]);
                }
            if($error_flag){
               $connection->rollBack();
                http_response_code(500);
                echo json_encode(["message"=> "The server was unable to complete your request. Please try again later."]);
            }
            exit();
        }
        case 'GET':{
            $month=NULL;
            if(isset($_GET["month"])&&$_GET["month"]>=1&&$_GET["month"]<13) $month=$_GET["month"];
            $year=NULL;
            if(isset($_GET["year"])) $year=$_GET["year"];
            $client=NULL;
            if(isset($_GET["client"])) $client=$_GET["client"];
            $mode=$_GET["mode"];
            $sql="";
            if($mode!=2)  $sql="SELECT report_id, pracownik.name as p_name, klient.name as k_name, date, content,notes FROM raport LEFT JOIN klient USING(client_nip) LEFT JOIN pracownik USING(employee_id)";
            if($mode==2)  $sql="SELECT report_id, email FROM email_report JOIN email_client USING(email_id)";
            if($month&&$year) $sql.=" WHERE Month(date)=:month AND Year(date)=:year";
            elseif($month) $sql.=" WHERE Month(date)=:month";
            elseif($year)$sql.=" WHERE Year(date)=:year";
            if($client)$sql.=" WHERE client_nip=:nip";
            $sql.=" ORDER BY report_id desc";
            if($mode==1)$sql.=" LIMIT 100";
            $query=$connection->prepare($sql);
            if($month) $query->bindValue(":month",$month,PDO::PARAM_INT);
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
        default:
            http_response_code(404);
            echo json_encode(["message" => "Unsupported request"]);
            exit();
    }
?>