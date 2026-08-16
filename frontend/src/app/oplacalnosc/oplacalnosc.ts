import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/auth';
import * as XLSX from 'xlsx';
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
  rates:Array<any>=[];// contains: rate.name, rate.client_nip, rate.rate
  error_message:String="";
  selected:String="";
  client_work:Array<any>=[];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ){}
  ngOnInit(){
    this.authService.check_login();
    this.authService.check_admin();
    this.get_rates();
  }
  get_rates(){
    this.loading=true;
    let gets=this.get_gets();
    console.log(gets);
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client_rates${gets}`).subscribe({
        next: data => {
            this.loading=false;
            this.rates=data;
            this.selected="";
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
    let in_month2=document.getElementById("month_filter-2") as HTMLInputElement;
    let month2=in_month2.value;
    let in_year=document.getElementById("year_filter") as HTMLInputElement;
    let year=in_year.value;
    if(year && month)gets="?year="+year+"&month="+month;
    else if(year)gets="?year="+year;
    else if(month)gets="?month="+month;
    if(month&&month2)gets+="&month2="+month2;
    return gets;
  }
  process_work_done(id:String){
    let client_work_http="";
    let previous="";
    let time;
    let sum=0;
    for(let work of this.client_work){
      time=(Number)(work.time).toFixed(2);
      if(work.work_type!=previous){
        if(previous){
          client_work_http+="<p class=\"font-bold mt-2\">Suma: "+sum.toFixed(2)+" h</p>";
          sum=0;
          client_work_http+="</div></div>";
        }
        previous=work.work_type;
        client_work_http+="<div><div class=\"bg-amber-500 rounded-xl text-2xl\">"+work.work_type+"</div><div class=\"text-right text-xl\">";
        client_work_http+="<p>"+work.p_name+": "+time+" h</p>";
        sum+=(Number)(work.time);
      }else{
        sum+=(Number)(work.time);
        client_work_http+="<p>"+work.p_name+": "+time+" h</p>";
      }
    }
    client_work_http+="<p class=\"font-bold mt-2\">Suma: "+sum.toFixed(2)+" h</p>";
    client_work_http+="</div></div>";
    let elem=document.getElementById("roll_down"+id) as HTMLElement;
    elem.innerHTML=client_work_http;
  }
  export_rates_excel(): void{
    if(!this.rates || this.rates.length === 0) {
      return;
    }
    // Prepare the data with the columns you want in Excel
    const excelData = this.rates.map(rate => ({
      Nazwa: rate.name,
      'NIP': rate.client_nip,
      Stawka: rate.rate
    }));
    // Create worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    // Create workbook
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rates');
    // Download file
    XLSX.writeFile(workbook, 'raport_stawek.xlsx');
  }
}
