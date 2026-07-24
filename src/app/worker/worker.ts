import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-worker',
  imports: [],
  templateUrl: './worker.html',
  styleUrl: './worker.css',
})
export class Worker {
  private http = inject(HttpClient);
  loading:boolean=false;
  works:Array<any>=[];
  error_message:String="";
  clients:Array<any>=[];
  user_id:String|null="";
  worker:String="";
  job_list=["Księgowanie faktur","Księgowanie WB","Księgowanie PK","Analizy","Podatki",
              "Wystawianie faktur sprzedaży","Wprowadzanie płatności","Raporty dla klienta","Sprawozdania GUS","Usługi kadrowe","Inne"];
  jobs:Map<String,number>=new Map;

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ){}
  ngOnInit(){
    if(!sessionStorage.getItem("logged")) this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }});

    this.route.paramMap.subscribe((obs) => {
      this.user_id=obs.get('id');
    });
    if(!this.user_id) return;

    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client`).subscribe({
        next: data => {
            this.clients=data;
            this.loading=false;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.error_message = error.error.detail;
            console.error('There was an error!', error);
            this.loading=false;
            return;
        }
      })
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/register/${this.user_id}`).subscribe({
      next: data => {
          this.worker=data[0].name+" "+data[0].email;
          this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
          this.error_message = error.error.detail;
          console.error('There was an error!', error);
          return;
      }
    })
    this.get_work();
  }
  get_work(){
    let gets="";

    let in_month=document.getElementById("month_filter") as HTMLInputElement;
    let month=in_month.value;
    let in_year=document.getElementById("year_filter") as HTMLInputElement;
    let year=in_year.value;
    if(year && month)gets="?year="+year+"&month="+month;
    else if(year)gets="?year="+year;
    else if(month)gets="?month="+month;

    let in_date=document.getElementById("date_filter") as HTMLInputElement;
    let date=in_date.value;
    let in_client=document.getElementById("client_filter") as HTMLInputElement;
    let client=in_client.value;
    if(date)gets="?date="+date;
    if(client){
      if(gets) gets+="&id="+client;
      else gets="?id="+client;
    }
    console.log(gets);
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/staff/${this.user_id}${gets}`).subscribe({
        next: data => {
            this.works=data;
            this.process_work();
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.error_message = error.error.detail;
            console.error('There was an error!', error);
            return;
        }
      })
  }
  process_work(){
    for(let job of this.job_list) this.jobs.set(job,0);
    for(let work of this.works){
      let time:number=(Number)(work.time);
      let time2:number=this.jobs.get(work.work_type)||0;
      this.jobs.set(work.work_type,time2+time);
    }
  }
  Delete(id:number){
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/work_done/${this.works[id].work_id}`).subscribe({
        next: data => {
            this.works.splice(id,1);
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
