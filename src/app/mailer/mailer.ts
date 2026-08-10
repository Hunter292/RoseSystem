import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../core/auth';
@Component({
  selector: 'app-mailer',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './mailer.html',
  styleUrl: './mailer.css',
})
export class Mailer {
  private http = inject(HttpClient);
  loading:boolean=false;
  error_message:string="";
  success_message:string="";
  inputForm: FormGroup;
  reports:Array<any>=[];
  report_emails:Array<any>=[];
  report_email_list:Array<any>=[];
  clients:Array<any>=[];
  client_mails:Array<any>=[];
  emails:number=1;
  reports_loaded:boolean=false;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    
  ){
    this.inputForm = this.fb.group({
      client_nip: ['', Validators.required],
      VAT7: ['', ],
      VAT7K: ['',],
      VAT98: ['',],
      CIT8: ['',],
      PIT4: ['',],
      ZUS: ['',],

    });
  }
  ngOnInit(){
    this.authService.check_login();
    

    this.load_reports();
    this.get_clients();
  }
  async load_reports(){
    this.reports_loaded=false;
    await this.get_reports(1);
    this.get_reports(2);
  }
  async get_reports(mode:number=1):Promise<void>{
    let gets="";
    let in_date=document.getElementById("month_filter") as HTMLInputElement;
    let month=in_date.value;
    let in_year=document.getElementById("year_filter") as HTMLInputElement;
    let year=in_year.value;
    let in_client=document.getElementById("client_filter") as HTMLInputElement;
    if(month && year)gets="?month="+month+"&year="+year;
    else if(month)gets="?month="+month;
    else if(year)gets="?year="+year;
    if(in_client.value) gets="?client="+in_client.value;
    if(in_client.value || year || month) gets+="&mode="+mode;
    else gets="?mode="+mode;
    try{
      const response = await firstValueFrom(
        this.http.get<any>(`${sessionStorage.getItem("apiURL")}/mailer${gets}`)
        /*.subscribe({
            next: data => {
                if(mode==2){
                  this.report_emails=data;
                  this.process_mail();
                }
                else this.report_emails=data;
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                this.error_message = error.error.message;
                this.success_message="";
                console.error('There was an error!', error);
                return;
            }
        })*/
      );
      if(mode==2){
        this.report_emails=response;
        this.process_mail();
      }
      else this.reports=response;
      this.changeDetectorRef.detectChanges();
    }catch(error:any){
      this.error_message=error.error.message;
      console.error('There was an error!', error);
      this.changeDetectorRef.detectChanges();
    }
    this.loading=false;
    return ;
  }
  get_clients(){
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client`).subscribe({
      next: data => {
          this.clients=data;
          this.loading=false;
          this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
          this.error_message = error.error.message;
          this.success_message="";
          console.error('There was an error!', error);
          this.loading=false;
          this.changeDetectorRef.detectChanges();
          return;
      }
    })
  }
  get_emails(){
    this.loading=true;
    let nip=this.inputForm.get("client_nip")?.value;
    if(!nip) return;
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/client_mail/${nip}`).subscribe({
      next: data => {
          this.client_mails=data;
          if(!this.client_mails.length) this.client_mails.push({email_id:'0',email:"Brak znanych emaile"})
          this.emails=1;
          this.loading=false;
          this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
          this.error_message = error.error.message;
          this.success_message="";
          console.error('There was an error!', error);
          this.loading=false;
          this.changeDetectorRef.detectChanges();
          return;
      }
    })
  }
  file_report(){
    if(this.inputForm.invalid){
      this.success_message="";
      this.error_message="Brakuje danych";
      this.changeDetectorRef.detectChanges();
      return;
    }
    let {client_nip,VAT7,VAT7K,VAT98,CIT8,PIT4,ZUS}=this.inputForm.value;
    let taxes=[VAT7,VAT7K,VAT98,CIT8,PIT4,ZUS];
    const pattern=/^\d+\.*\d*$/;
    for(let i=0;i<6;i++){
      if(!taxes[i]) taxes[i]="0";
      taxes[i]=taxes[i].replace(',','.');
      taxes[i]=taxes[i].replace(' ','');
      if(!pattern.test(taxes[i])){
        this.success_message="";
        this.error_message="Wpisane kwoty nie są liczbami";
        this.changeDetectorRef.detectChanges();
        return;
      }
    }
    let emails=[];
    let elem;
    for(let i=0;i<this.emails-1;i++){
      elem=document.getElementById("email-"+i) as HTMLInputElement;
      if(elem.value=="0"){
        this.success_message="";
        this.error_message="Proszę wybrać email";
        this.changeDetectorRef.detectChanges();
        return;
      }
      emails.push(elem.value);
    }
    if(!emails.length){
      this.success_message="";
      this.error_message="Proszę wybrać email";
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.loading=true;
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/mailer`,{client_nip:client_nip,VAT7:taxes[0],VAT7K:taxes[1],VAT98:taxes[2],CIT8:taxes[3],PIT4:taxes[4],ZUS:taxes[5],emails:emails}).subscribe({
      next: data => {
          this.loading=false;
          let elem;
          for(let i=this.emails-2;i>=0;i--){
            elem=document.getElementById("email-"+i) as HTMLInputElement;
            elem.value="0";
          }
          this.emails=1;
          this.inputForm.reset();
          this.error_message="";
          this.success_message="Mail został wysłany";
          this.load_reports();
          this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
          this.error_message = error.error.details;
          this.success_message="";
          console.error('There was an error!', error);
          this.loading=false;
          this.changeDetectorRef.detectChanges();
          return;
      }
    })
  }
  process_mail(){
    // add am actual mailer in the back, add mail recovery,
    // add extra data validation in the back, add comments,complete documentation and make user manual
    let previous=0;
    let text=""
    for(let email of this.report_emails){
      if(email.report_id!= previous){
        if(previous)this.report_email_list.push(text);
        previous=email.report_id;
        text=email.email;
      }else text+="\n"+email.email;
    }
    this.report_email_list.push(text);
    this.reports_loaded=true;
  }
  change_email(event:Event){
    let input=event.target as HTMLInputElement;
    if(input.value=="0"){
      if(this.emails>1) this.emails-=1;
      return;
    }
    this.emails+=1;
  }
  file_email(){
    let nip=this.inputForm.get("client_nip")?.value;
    if(!nip){
      this.success_message="";
      this.error_message="Napierw wybierz klienta";
      return;
    }
    let input=document.getElementById("email-new") as HTMLInputElement
    let email=input.value;
    const pattern=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(!pattern.test(email)){
      this.success_message="";
      this.error_message="Nieprawidłowy email";
      return;
    }
    this.loading=true;
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/client_mail/${nip}`,{email:email}).subscribe({
      next: data => {
          this.get_emails();
          this.loading=false;
          this.success_message="Dodano mail";
          input.value="";
          this.error_message="";
          let elem;
          for(let i=this.emails-2;i>=0;i--){
            elem=document.getElementById("email-"+i) as HTMLInputElement;
            elem.value="0";
          }
          this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
          this.error_message = error.error.message;
          this.success_message="";
          console.error('There was an error!', error);
          this.loading=false;
          this.changeDetectorRef.detectChanges();
          return;
      }
    })
  }
  format_mula(text:string):string{
    text=text.replace('.',',');
    let length=text.length-3;
    if(length>3){
      text=text.substring(0,text.length-6)+'\u00A0'+text.substring(text.length-6);
    }
    return text;
  }
  createRange(number:number){
  // return new Array(number);
  return new Array(number).fill(0)
    .map((n, index) => index + 1);
  }
}
