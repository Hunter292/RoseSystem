import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-oplacalnosc',
  imports: [],
  templateUrl: './oplacalnosc.html',
  styleUrl: './oplacalnosc.css',
})
@Injectable({providedIn: 'root'})
export class Oplacalnosc {
  private http = inject(HttpClient);
  loading:boolean=false;
  rates:Array<any>=[];
  error_message:String="";
  selected:String="";
  client_work:Array<any>=[];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ){}
  ngOnInit(){
    this.get_rates();
  }
  get_rates(){
    this.loading=true;
    let gets=this.get_gets();
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client_rates${gets}`).subscribe({
        next: data => {
            this.loading=false;
            this.rates=data;
            this.error_message="";
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.error_message = error.error.detail;
            console.error('There was an error!', error);
            this.loading=false;
            return;
        }
  })
  }
  get_work_done(id:String){
    this.loading=true;
    let gets=this.get_gets();
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client_work/${id}${gets}`).subscribe({
        next: data => {
            this.loading=false;
            this.client_work=data;
            this.selected=id;
            this.changeDetectorRef.detectChanges();
            this.process_work_done(id);
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
  get_gets(){
    let gets="";
    let in_month=document.getElementById("month_filter") as HTMLInputElement;
    let month=in_month.value;
    let in_year=document.getElementById("year_filter") as HTMLInputElement;
    let year=in_year.value;
    if(year && month)gets="?year="+year+"&month="+month;
    else if(year)gets="?year="+year;
    else if(month)gets="?month="+month;
    return gets;
  }
  process_work_done(id:String){
    let client_work_http="";
    let previous="";
    let time;
    let sum;
    for(let work of this.client_work){
      time=(Number)(work.time).toFixed(2);
      if(work.work_type!=previous){
        if(previous){
          client_work_http+="</div></div>";
        }
        previous=work.work_type;
        client_work_http+="<div><div class=\"bg-emerald-500 rounded-xl text-2xl\">"+work.work_type+"</div><div class=\"text-left\">";
        client_work_http+="<p>"+work.p_name+": "+time+"</p>";
      }else{

        client_work_http+="<p>"+work.p_name+": "+time+"</p>";
      }
    }
    client_work_http+="</div></div>";
    let elem=document.getElementById("roll_down"+id) as HTMLElement;
    elem.innerHTML=client_work_http;
  }
}
