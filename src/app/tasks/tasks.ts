import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/auth';
import { Util } from '../core/util';

@Component({
  selector: 'app-tasks',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  private http=inject(HttpClient);
  inputForm: FormGroup;
  error_message: string | null = null;
  success_message:string="";
  loading = true;
  users_tasks:Array<any>=[];
  users_tasks_members:Array<any>=[];
  users_tasks_proccessed:Array<any>=[];
  to_user_tasks:Array<any>=[];
  to_user_tasks_members:Array<any>=[];
  to_user_tasks_proccessed:Array<any>=[];
  to_user_tasks_status:Array<any>=[];
  clients: Array<any>=[];
  workers:Array<any>=[];
  users:number=1;
  patch:number=0;

  task_status:any=null;
  edited_task:any=null;
  edited_worker:any=null;
  to_task:any=null;
   constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    public  util:Util,
  ){
    this.inputForm = this.fb.group({
      client_nip: ['', Validators.required],
      desc: ['', Validators.required],
      date: ['',Validators.required],
    });
  }
  ngOnInit(){
    this.authService.check_login();
    this.clients=this.util.get_clients();
    if(!this.clients.length) this.error_message="Problem z pobraniem danych klientów";
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/register`).subscribe({
        next: data => {
            this.workers=data;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.error_message = error.error.message;
            console.error('There was an error!', error);
            return;
        }
    })
    this.get_tasks(0);
    this.get_tasks(1);
  }
  get_tasks(mode:number=0){
    let gets=this.get_gets(mode);
    gets+="&mode="+mode;
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/task${gets}`).subscribe({
        next: data => {
            if(!mode){
              this.to_user_tasks=data;
            }else{
              this.users_tasks=data;
            }
            this.get_tasks_members(mode,gets);
        },
        error: (error) => {
            this.error_message = error.error.message;
            console.error('There was an error!', error);
            return;
        }
    })
  }
  get_tasks_members(mode:number,gets:string){
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/task/members${gets}`).subscribe({
        next: data => {
            if(!mode){
              this.to_user_tasks_members=data;
            }else{
              this.users_tasks_members=data;
            }
        },
        error: (error) => {
            this.error_message = error.error.message;
            console.error('There was an error!', error);
            return;
        }
    })
  }
  get_assigned_tasks_members(mode:number){
    let members=this.to_user_tasks_members;
    if(mode){
      this.users_tasks_proccessed=[];
      members=this.users_tasks_members;
    }else{
      this.to_user_tasks_proccessed=[];
      this.to_user_tasks_status=[];
    }
    let previous=0;
    let names:Array<any>=[];
    let id=this.authService.currentUserValue.id;
    for(let member of members){
      if(member.employee_id!=previous){
        if(previous){
          if(mode) this.users_tasks_proccessed.push(names);
          else this.to_user_tasks_proccessed.push(names);
        }
        names=[];
        previous=member.employee_id;
        if(member.employee_id!=id ||mode)names.push({employee_id:member.employee_id,name:member.name,email:member.email,status:member.status});
        else this.to_user_tasks_status.push(member.status);
      }else{
        if(member.employee_id!=id ||mode)names.push({employee_id:member.employee_id,name:member.name,email:member.email,status:member.status});
        else this.to_user_tasks_status.push(member.status);
      }
    }
    if(mode) this.users_tasks_proccessed.push(names);
    else this.to_user_tasks_proccessed.push(names);
  }
  file_task(){
    if(this.inputForm.invalid){
      this.error_message="Brakuje informacji";
      this.success_message="";
      return;
    }
    let users=[];
    let elem;
    for(let i=0;i<this.users-1;i++){
      elem=document.getElementById("user-"+i) as HTMLInputElement;
      if(elem.value=="0"){
        this.success_message="";
        this.error_message="Proszę wybrać email";
        this.changeDetectorRef.detectChanges();
        return;
      }
      users.push(elem.value);
    }
    if(!users.length){
      this.success_message="";
      this.error_message="Proszę wybrać email";
      this.changeDetectorRef.detectChanges();
      return;
    }
    const {client_nip, desc, date}=this.inputForm.value;
    let client_only= document.getElementById("client_only") as HTMLInputElement;
    let priority=client_only.checked?1:0;
    this.loading=true;
    if(!this.patch){
      this.http.post<any>(`${sessionStorage.getItem("apiURL")}/tasks`, { client_nip:client_nip,description:desc,deadline:date,priority:priority,victims:users
      }).subscribe({
          next: data => {
              this.loading=false;
              this.error_message="";
              this.success_message="Dodano zadanie";
              this.inputForm.reset();
              this.reset_users();
              this.get_tasks(1);
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
      this.http.patch<any>(`${sessionStorage.getItem("apiURL")}/tasks/${this.patch}`, { client_nip:client_nip,description:desc,deadline:date,priority:priority
      }).subscribe({
          next: data => {
              this.loading=false;
              this.success_message="Zmodyfikowano zadanie";
              this.error_message="";
              this.inputForm.reset();
              this.reset_users();
              this.patch=0;
              this.get_tasks(1);
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
  get_gets(id:number=0){
    let gets="";
    let in_month=document.getElementById("month_filter"+id) as HTMLInputElement;
    let month=in_month.value;
    let in_year=document.getElementById("year_filter"+id) as HTMLInputElement;
    let year=in_year.value;
    let in_status=document.getElementById("status_filter"+id) as HTMLInputElement;
    let status=in_status.value;
    if(year && month)gets="?year="+year+"&month="+month;
    else if(year)gets="?year="+year;
    else if(month)gets="?month="+month;
    if(gets) gets+="&status="+status;
    else gets="?status="+status;
    return gets;
  }
  change_user(event:Event){
    let input=event.target as HTMLInputElement;
    if(input.value=="0"){
      if(this.users>1) this.users-=1;
      return;
    }
    this.users+=1;
  }
  change_status(task:any,status:number=0){
    if(!this.task_status){
      this.task_status=task;
      return;
    }
    this.loading=true;
    this.http.patch<any>(`${sessionStorage.getItem("apiURL")}/tasks_member/${this.patch}/${this.authService.currentUserValue.id}`, { status:status
      }).subscribe({
          next: data => {
              this.loading=false;
              this.success_message="Zmieniono status zadania";
              this.error_message="";
              let index=this.to_user_tasks.indexOf(this.task_status);
              this.to_user_tasks_status[index]=status;
              this.task_status=null;
          },
          error: (error) => {
              this.error_message = error.error.detail;
              this.success_message="";
              console.error('There was an error!', error);
              this.loading=false;
              this.task_status=null;
              return;
          }
      })
  }
  remove_from_task(task:any,member:any){
    if(!this.edited_worker){
      this.edited_task=task;
      this.edited_worker=member;
      return;
    }
    this.loading=true;
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/tasks_member/${this.edited_task.task_id}/${this.edited_worker.employee_id}`
      ).subscribe({
          next: data => {
              this.loading=false;
              this.success_message="Usunięto "+this.edited_worker.name+" z zadania";
              this.error_message="";
              let index=this.users_tasks.indexOf(this.edited_task);
              this.users_tasks_proccessed[index].splice(this.users_tasks_proccessed[index].indexOf(this.edited_worker),1);
              this.edited_task=null;
              this.edited_worker=null;
          },
          error: (error) => {
              this.error_message = error.error.detail;
              this.success_message="";
              console.error('There was an error!', error);
              this.loading=false;
              this.edited_task=null;
              this.edited_worker=null;
              return;
          }
      })
  }
  add_to_task(task:any){
    if(!this.to_task){
      this.to_task=task;
      return;
    }
    this.loading=true;
    let elem=document.getElementById("input_add_worker") as HTMLInputElement;
    let worker=this.workers[Number(elem.value)];
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/tasks_member/${this.to_task.task_id}`,{employee_id:worker.employee_id
      }).subscribe({
          next: data => {
              this.loading=false;
              this.success_message="Dodano "+worker.name+" do zadania";
              this.error_message="";
              let index=this.users_tasks.indexOf(this.to_task);
              this.users_tasks_proccessed[index].push({employee_id:worker.employee_id,name:worker.name,email:worker.email,status:0});
              this.to_task=null;
          },
          error: (error) => {
              this.error_message = error.error.detail;
              this.success_message="";
              console.error('There was an error!', error);
              this.loading=false;
              this.to_task=null;
              return;
          }
      })
  }
  Edit_task(task:any){
    this.edited_task=task;
  }
  Patch(){
    this.inputForm.get("client_nip")?.setValue(this.edited_task.client_nip);
    this.inputForm.get("desc")?.setValue(this.edited_task.description);
    this.inputForm.get("date")?.setValue(this.edited_task.deadline);
    this.patch=this.edited_task.task_id;
    this.edited_task=null;
    this.reset_users();
  }
  Delete(){
    this.loading=true;
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/tasks/${this.edited_task.task_id}`
      ).subscribe({
          next: data => {
              this.loading=false;
              this.success_message="Usunięto zadania";
              this.error_message="";
              let index=this.users_tasks.indexOf(this.edited_task);
              this.users_tasks.splice(index,1);
              this.users_tasks_proccessed.splice(index,1);
              this.edited_task=null;
          },
          error: (error) => {
              this.error_message = error.error.detail;
              this.success_message="";
              console.error('There was an error!', error);
              this.loading=false;
              this.edited_task=null;
              return;
          }
      })
  }
  translate_status(status:number){
    switch(status){
      case 0:return "Nie przeczytano";
      case 1:return "Zapoznano się";
      case 2:return "W trakcie";
      case 3:return "Wykonano";
      default: return "Error";
    }
  }
  color_status(status:number):string{
    let classes:string="flex";
    switch(status){
      case 0: classes+=" bg-red-500";break;
      case 1: classes+=" bg-amber-400";break;
      case 2: classes+=" bg-green-300";break;
      case 3: classes+=" bg-green-500";break;
      default: classes+=" bg-red-500";break;
    }
    return classes;
  }
  createRange(number:number){
  // return new Array(number);
  return new Array(number).fill(0)
    .map((n, index) => index + 1);
  }
  reset_users(){
    let elem;
    for(let i=this.users-2;i>=0;i--){
      elem=document.getElementById("user-"+i) as HTMLInputElement;
      elem.value="0";
    }
    this.changeDetectorRef.detectChanges();
  }
}