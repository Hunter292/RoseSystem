import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/auth';
import { Util } from '../core/util';

@Component({
  selector: 'app-work-done',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './work-done.html',
  styleUrl: './work-done.css',
})
@Injectable({providedIn: 'root'})
export class WorkDone {
  inputForm: FormGroup;
  error_message: string | null = null;
  success_message:string="";
  loading = true;
  clients: Array<any>=[];
  work_done:Array<any>=[];
  edited_work:any=null;
  patch:number=0;
  private http = inject(HttpClient);
  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    public util:Util,
  ){
    this.inputForm = this.fb.group({
      client_nip: ['', Validators.required],
      work_type: ['', Validators.required],
      date: ['',Validators.required],
      time_start: ['',Validators.required],
      time_finish: ['',Validators.required],
      notes: ['',],
    });
  }
  ngOnInit(){
    this.authService.check_login();
    this.clients=this.util.get_clients();
    if(!this.clients.length) this.error_message="Problem z pobraniem danych klientów";
    this.get_work();
    this.inputForm.get("date")?.setValue(this.util.get_date_str());
  }
  file_work() {
    if(this.inputForm.invalid){
      this.error_message="Brakuje informacji";
      return;
    }
    const {client_nip, work_type, date, time_start, time_finish,notes}=this.inputForm.value;
    this.loading=true;
    if(!this.patch){
      this.http.post<any>(`${sessionStorage.getItem("apiURL")}/work_done`, { client_nip:client_nip,work_type:work_type,date:date,
        time_start:time_start,time_finish:time_finish,notes:notes
      }).subscribe({
          next: data => {
              this.loading=false;
              this.error_message="";
              this.success_message="Dodano czynność";
              this.inputForm.reset();
              this.inputForm.get("client_nip")?.setValue(client_nip);
              
              this.inputForm.get("date")?.setValue(this.util.get_date_str());
              this.get_work();
              this.changeDetectorRef.detectChanges();
          },
          error: (error) => {
              this.error_message = error.error.detail;
              this.success_message="";
              console.error('There was an error!', error);
              this.loading=false;
              return;
          }
      })
    }else{
      this.http.patch<any>(`${sessionStorage.getItem("apiURL")}/work_done/${this.patch}`, { client_nip:client_nip,work_type:work_type,date:date,
        time_start:time_start,time_finish:time_finish
      }).subscribe({
          next: data => {
              this.loading=false;
              this.success_message="Zmodyfikowano czynność";
              this.error_message="";
              this.inputForm.reset();
              this.patch=0;
              this.inputForm.get("date")?.setValue(this.util.get_date_str());
              this.get_work();
          },
          error: (error) => {
              this.error_message = error.error.detail;
              this.success_message="";
              console.error('There was an error!', error);
              this.loading=false;
              return;
          }
      })
    }
  }
  Patch(work:any){
    this.inputForm.get("client_nip")?.setValue(work.client_nip);
    this.inputForm.get("work_type")?.setValue(work.work_type);
    this.inputForm.get("date")?.setValue(work.date);
    this.inputForm.get("time_start")?.setValue(work.time_start);
    this.inputForm.get("time_finish")?.setValue(work.time_finish);
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
    this.patch=work.work_id;
    this.edited_work=null;
  }
  Delete(work:any){
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/work_done/${work.work_id}`).subscribe({
        next: data => {
            this.work_done.splice(this.work_done.indexOf(work),1);
            this.edited_work=null;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.error_message = error.error.detail;
            this.success_message="";
            console.error('There was an error!', error);
            return;
        }
      })
  }
  Edit(work:any){
    this.edited_work=work;
  }
  get_work(){
    let gets="";
    let in_date=document.getElementById("date_filter") as HTMLInputElement;
    let date=in_date.value;
    let in_client=document.getElementById("client_filter") as HTMLInputElement;
    let client=in_client.value;
    if(client && date)gets="?id="+client+"&date="+date;
    else if(client)gets="?id="+client;
    else if(date)gets="?date="+date;
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/work_done${gets}`).subscribe({
        next: data => {
            this.work_done=data;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.error_message = error.error.detail;
            console.error('There was an error!', error);
            return;
        }
      })
  }
  
}
