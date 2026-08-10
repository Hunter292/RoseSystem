import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth';
@Component({
  selector: 'app-staff',
  imports: [],
  templateUrl: './staff.html',
  styleUrl: './staff.css',
})
export class Staff {
  private http = inject(HttpClient);
  loading:boolean=false;
  staves:Array<any>=[];
  error_message:String="";
  workers:Array<any>=[];
  job_list=["Księgowanie faktur","Księgowanie WB","Księgowanie PK","Analizy","Podatki",
              "Wystawianie faktur sprzedaży","Wprowadzanie płatności","Raporty dla klienta","Sprawozdania GUS","Usługi kadrowe","Inne"];
  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ){}
  ngOnInit(){
    this.authService.check_login();
    this.authService.check_admin();
    this.get_staff();
  }
  get_staff(){
    this.loading=true;
    let gets="";
    let in_month=document.getElementById("month_filter") as HTMLInputElement;
    let month=in_month.value;
    let in_year=document.getElementById("year_filter") as HTMLInputElement;
    let year=in_year.value;
    if(year && month)gets="?year="+year+"&month="+month;
    else if(year)gets="?year="+year;
    else if(month)gets="?month="+month;
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/staff${gets}`).subscribe({
        next: data => {
            this.loading=false;
            this.staves=data;
            this.process_staff();
            this.changeDetectorRef.detectChanges();
            this.error_message="";
        },
        error: (error) => {
            this.error_message = error.error.detail;
            console.error('There was an error!', error);
            this.loading=false;
            return;
        }
    })
  }
  process_staff(){
    let sum=0;
    let previous="";
    //let http_code="";
    //let inner_code="";
    let head="";
    let time;
    let id;
    let jobs=new Map;
    for(let staff of this.staves){
      time=(Number)(staff.time).toFixed(2);
      if(staff.email!=previous){
        if(previous){
          let list:Array<String>=[];
          for(let job of this.job_list) list.push(jobs.get(job));
          //for(let job of this.job_list) inner_code+="<p>"+job+": "+jobs.get(job)+"</p>";
          //inner_code+="</div>";
          //http_code+=head+sum.toFixed(2)+"</p></div>";
          //http_code+=inner_code;
          //http_code+="</div>"
          this.workers.push({id:id,head:head+sum.toFixed(2),body:list});
          //inner_code="";
          sum=0;
        }
        id=staff.employee_id;
        jobs.clear();
        for(let job of this.job_list) jobs.set(job,"0.00");
        previous=staff.email;
        head=""+staff.name+" "+staff.email+" Godziny: ";
        //inner_code+="<div class=\"md:grid md:grid-cols-2 gap-y-2 divide-y-2 divide-solid divide-primary-300 p-2 text-xl text-right\">";
        jobs.set(staff.work_type,time);
        sum+=(Number)(staff.time);
      }else{
        jobs.set(staff.work_type,time);
        sum+=(Number)(staff.time);
      }
    }
    //for(let job of this.job_list) inner_code+="<p>"+job+": "+jobs.get(job)+"</p>"
    let list:Array<String>=[];
    for(let job of this.job_list) list.push(jobs.get(job));
    //inner_code+="</div>";
    //http_code+=head+sum.toFixed(2)+"</p></div>";
    //http_code+=inner_code;
    //http_code+="</div>";
    this.workers.push({id:id,head:head+sum.toFixed(2),body:list});

    //let elem=document.getElementById("table") as HTMLElement;
    //elem.innerHTML=http_code;
  }
  to_worker(id:String){
    this.router.navigate(['/pracownicy/'+id]);
  }
}
