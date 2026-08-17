<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
class email_sender{
    public static function prepare_email(Array $emails,string $from_m, string $from_n, string $subject): PHPMailer{
        $mail=new PHPMailer();
        $mail->isSMTP();
        //$mail->Host='smtp.rozowaksiegowa.pl';
        $mail->Host='smtp.gmail.com';
        $mail->Port=587;
        $mail->SMTPSecure='tls';
        $mail->SMTPAuth=true;
        $mail->Username=getenv('MAIL_USER');
        $mail->Password=getenv("MAIL_PASS");
        $mail->CharSet='UTF-8';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->setFrom($from_m,$from_n);
        //foreach($emails as $email)$mail->addAddress($email);
        $mail->addReplyTo('biuro@rozowaksiegowa.pl','Biuro');
        $mail->isHTML(true);
        $mail->Subject=$subject;
        return $mail;
    }
}
 ?>