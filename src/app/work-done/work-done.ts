import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signal } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth';


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
  errorMessage: string | null = null;
  loading = true;
  clients: Array<any>=[];
  work_done:Array<any>=[];
  client:String="";
  date:String="";
  patch:number=0;
  private http = inject(HttpClient);
  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ){
    this.inputForm = this.fb.group({
      client_nip: ['', Validators.required],
      work_type: ['', Validators.required],
      date: ['',Validators.required],
      time_start: ['',Validators.required],
      time_finish: ['',Validators.required],
    });
  }
  ngOnInit(){
    this.authService.check_login();
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client`).subscribe({
        next: data => {
            this.clients=data;
            this.loading=false;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.errorMessage = error.error.detail;
            console.error('There was an error!', error);
            this.loading=false;
            return;
        }
      })
      this.get_work();
    let today=new Date();
    this.inputForm.get("date")?.setValue(today.getFullYear()+'-'+String(today.getMonth() + 1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0'));
  }
  file_work() {
    if(this.inputForm.invalid){
      this.errorMessage="Brakuje informacji";
      return;
    }
    const {client_nip, work_type, date, time_start, time_finish}=this.inputForm.value;
    this.loading=true;
    if(!this.patch){
      this.http.post<any>(`${sessionStorage.getItem("apiURL")}/work_done`, { client_nip:client_nip,work_type:work_type,date:date,
        time_start:time_start,time_finish:time_finish
      }).subscribe({
          next: data => {
              this.loading=false;
              this.errorMessage="";
              this.inputForm.reset();
              this.inputForm.get("client_nip")?.setValue(client_nip);
              this.get_work();
              this.changeDetectorRef.detectChanges();
          },
          error: (error) => {
              this.errorMessage = error.error.detail;
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
              this.errorMessage="";
              this.inputForm.reset();
              this.patch=0;
              let today=new Date();
              this.inputForm.get("date")?.setValue(today.getFullYear()+'-'+String(today.getMonth() + 1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0'));
              this.get_work();
          },
          error: (error) => {
              this.errorMessage = error.error.detail;
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

  }
  Delete(id:number){
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/work_done/${this.work_done[id].work_id}`).subscribe({
        next: data => {
            this.work_done.splice(id,1);
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.errorMessage = error.error.detail;
            console.error('There was an error!', error);
            return;
        }
      })
  }
  get_work(){
    let gets="";
    let in_date=document.getElementById("date_filter") as HTMLInputElement;
    this.date=in_date.value;
    let in_client=document.getElementById("client_filter") as HTMLInputElement;
    this.client=in_client.value;
    if(this.client && this.date)gets="?id="+this.client+"&date="+this.date;
    else if(this.client)gets="?id="+this.client;
    else if(this.date)gets="?date="+this.date;
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/work_done${gets}`).subscribe({
        next: data => {
            this.work_done=data;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.errorMessage = error.error.detail;
            console.error('There was an error!', error);
            return;
        }
      })
  }
}
