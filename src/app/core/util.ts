import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Util {
  private http=inject(HttpClient);

  async get_clients():Promise<any[]>{
    try{
      const response = await firstValueFrom(this.http.get<any>(`${sessionStorage.getItem("apiURL")}/report/client`));
      return response;
    }catch(error:any){
      console.error('There was an error!', error);
      return [];
    }
  }
  get_date_str(diff:number=0){
    let today=new Date();
    if(diff){
      let days=new Date("1970-01-0"+(diff+1));
      today=new Date(today.getTime()-days.getTime());
    }
    return today.getFullYear()+'-'+String(today.getMonth() + 1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');
  }
}
