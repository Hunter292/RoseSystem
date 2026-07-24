import { Component } from '@angular/core';
import { signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-income',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './income.html',
  styleUrl: './income.css',
})
@Injectable({providedIn: 'root'})
export class Income {
  anal_message:String="";
  file_ready:boolean=false;
  excelData: Array<any>=[];
  month:String="";
  year:String="";
  income:Array<any>=[];

  inputForm: FormGroup;
  clientForm: FormGroup;

  loading = true;
  clients: Array<any>=[];
  patch:String='';
  private http = inject(HttpClient);
  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
  ){
    this.inputForm = this.fb.group({
      client_nip: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['',Validators.required]
    });
    this.clientForm = this.fb.group({
      client_nip: ['', Validators.required],
      name: ['', Validators.required]
    });
  }
  ngOnInit(){
    if(!sessionStorage.getItem("logged")) this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }});
    this.get_income();
    this.get_clients();
  }
  input_file(event:Event){
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    if(!["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].find((elem)=>elem==file.type)){
      this.anal_message="Wrong file format";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      this.excelData=this.excelData.filter((elem)=>elem.NIP)
      this.file_ready=true;
      this.changeDetectorRef.detectChanges();
      console.log(this.excelData);
    };
    reader.readAsBinaryString(file);
  }
  send_income(){
    //add tickbox for inserting clients only
    for(let row of this.excelData){
      row["Data wyst."]=this.toMySQLDate(row["Data wyst."]);
      row["Netto"]=row["Netto"].replace(',','');
    }
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/report/income`, {data:this.excelData
      }).subscribe({
          next: data => {
              this.anal_message="";
              this.get_income();
              this.changeDetectorRef.detectChanges();
          },
          error: (error) => {
              this.anal_message = error.error.detail;
              console.error('There was an error!', error);
              return;
          }
      })
  }
  get_income(){
    let gets="";
    let in_date=document.getElementById("month_filter") as HTMLInputElement;
    this.month=in_date.value;
    let in_client=document.getElementById("client_filter") as HTMLInputElement;
    let in_year=document.getElementById("year_filter") as HTMLInputElement;
    this.year=in_client.value;
    if(this.month && this.year)gets="?month="+this.month+"&year="+this.year;
    else if(this.month)gets="?month="+this.month;
    else if(this.year)gets="?year="+this.year;
    if(in_client.value) gets="?client="+in_client.value;
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/income${gets}`).subscribe({
        next: data => {
            this.income=data;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.anal_message = error.error.detail;
            console.error('There was an error!', error);
            return;
        }
    })
  }
  get_clients(){
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client`).subscribe({
      next: data => {
          this.clients=data;
          this.loading=false;
          this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
          this.anal_message = error.error.detail;
          console.error('There was an error!', error);
          this.loading=false;
          return;
      }
    })
  }
  Delete(id:any){
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/report/income/${this.income[id].faktura_id}`).subscribe({
        next: data => {
            this.income.splice(id,1);
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.anal_message = error.error.detail;
            console.error('There was an error!', error);
            return;
        }
      })
  }
  Patch(inc:any){
    this.inputForm.get("client_nip")?.setValue(inc.client_nip);
    this.inputForm.get("amount")?.setValue(inc.amount);
    this.inputForm.get("date")?.setValue(inc.date);
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
    this.patch=inc.faktura_id;
  }
  file_income(){
    if(this.inputForm.invalid){
      this.anal_message="Brakuje informacji";
      return;
    }
    const {client_nip, amount, date}=this.inputForm.value;
    this.loading=true;
    if(!this.patch){
      this.http.post<any>(`${sessionStorage.getItem("apiURL")}/report/income?mode=1`, { client_nip:client_nip,amount:amount,date:date
      }).subscribe({
          next: data => {
              this.loading=false;
              this.anal_message="";
              this.inputForm.reset();
              this.get_income();
              this.changeDetectorRef.detectChanges();
          },
          error: (error) => {
              this.anal_message = error.error.detail;
              console.error('There was an error!', error);
              this.loading=false;
              return;
          }
      })
    }else{
      this.http.patch<any>(`${sessionStorage.getItem("apiURL")}/report/income/${this.patch}`, { client_nip:client_nip,amount:amount,date:date
      }).subscribe({
          next: data => {
              this.loading=false;
              this.anal_message="";
              this.inputForm.reset();
              this.patch="";
              let today=new Date();
              this.inputForm.get("date")?.setValue(today.getFullYear()+'-'+String(today.getMonth() + 1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0'));
              this.get_income();
          },
          error: (error) => {
              this.anal_message = error.error.detail;
              console.error('There was an error!', error);
              this.loading=false;
              return;
          }
      })
    }
  }
  file_client(){
    if(this.clientForm.invalid){
      this.anal_message="Brakuje informacji";
      return;
    }
    const {client_nip,name}=this.clientForm.value;
    this.loading=true;
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/report/client`, { client_nip:client_nip,name:name
      }).subscribe({
          next: data => {
              this.loading=false;
              this.anal_message="";
              this.clients.push({"client_nip":client_nip,"name":name});
              this.clientForm.reset();
              this.changeDetectorRef.detectChanges();
          },
          error: (error) => {
              this.anal_message = error.error.detail;
              console.error('There was an error!', error);
              this.loading=false;
              return;
          }
      })
  }
  delete_client(){
    let in_client=document.getElementById("client_delete") as HTMLInputElement;
    if(!in_client.value) return;
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/report/client/${in_client.value}`).subscribe({
          next: data => {
              this.loading=false;
              this.anal_message="";
              this.get_clients();
              in_client.value="";
              this.changeDetectorRef.detectChanges();
          },
          error: (error) => {
              this.anal_message = error.error.detail;
              console.error('There was an error!', error);
              this.loading=false;
              return;
          }
      })
  }
  toMySQLDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}
