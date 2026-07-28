import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth';
import { TokenStorageService } from '../core/token-storage';
@Component({
  selector: 'app-user-management',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {
  private http = inject(HttpClient);
  error_message:String="";
  success_message:String="";
  loading:boolean=false;
  inputForm: FormGroup;
  workers:Array<any>=[];
  patch:number=0;
  delete:number=0;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenStorageService,
    
  ){
    this.inputForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]],
      pass_admin: ['',Validators.required],
    });
    
  }
  ngOnInit(){
    this.authService.check_login();
    this.authService.check_admin();
    this.get_workers();
  }
  get_workers(){
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
  }
  file_worker(){
    if (this.inputForm.invalid){
      this.error_message="";
      if(this.inputForm.get('email')?.hasError('email') || this.inputForm.get('email')?.hasError('required')) this.error_message="Nieprawidłowy mail";
      if((this.inputForm.get('password')?.hasError('minlength')|| this.inputForm.get('password')?.hasError('required')) && !this.patch) this.error_message="Hasło jest za krótkie";
      this.changeDetectorRef.detectChanges();
      if(this.error_message) return;
    }
    this.loading = true;
    const {name,email,password,pass_admin}=this.inputForm.value;
    let box =document.getElementById("admin_box") as HTMLInputElement;
    let admin=box.checked;
    if(!this.patch){
      this.http.post<any>(`${sessionStorage.getItem("apiURL")}/register`, {username:name,password:password,email:email,pass_admin:pass_admin,admin:admin
        }).subscribe({
            next: data => {
                this.error_message="";
                this.success_message="Dodano użytkownika"
                this.get_workers();
                this.loading=false;
                this.inputForm.reset();
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                this.error_message = error.error.message;
                console.error('There was an error!', error);
                this.loading=false;
                this.success_message="";
                this.changeDetectorRef.detectChanges();
                return;
            }
        })
    }else{
      if(password && password.length<8){
        this.error_message="Hasło jest za krótkie";
        this.loading=false;
        return;
      }
      this.http.patch<any>(`${sessionStorage.getItem("apiURL")}/register/${this.patch}`, {username:name,password:password,email:email,pass_admin:pass_admin,admin:admin
        }).subscribe({
            next: data => {
                this.error_message="";
                this.success_message="Zmieniono użytkownika"
                this.get_workers();
                this.loading=false;
                this.patch=0;
                this.inputForm.reset();
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                this.error_message = error.error.message;
                console.error('There was an error!', error);
                this.patch=0;
                this.loading=false;
                this.success_message="";
                this.changeDetectorRef.detectChanges();
                return;
            }
        })
    }
  }
  Patch(worker:any){
    this.inputForm.reset();
    this.success_message="";
    this.inputForm.get("name")?.setValue(worker.name);
    this.inputForm.get("email")?.setValue(worker.email);
    let box=document.getElementById("admin_box") as HTMLInputElement;
    box.checked=worker.admin=='1'?true:false;
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
    this.patch=worker.employee_id;
    console.log(this.patch);
  }
  Delete(id:number=0){
    if(!this.delete){
      if(this.workers[id].employee_id==this.tokenService.getUser().id){
        this.error_message="Prosimy o nie dokonywanie samoterminacji";
        return;
      }
      this.delete=id+1;
      return;
    }
    this.loading=true;
    id=this.delete-1;
    let elem=document.getElementById("admin_pass") as HTMLInputElement;
    if(!elem.value||(elem.value).length<4){
      this.error_message="Za krótkie hasło";
      return;
    }
    this.http.request<any>("DELETE",`${sessionStorage.getItem("apiURL")}/register/${this.workers[id].employee_id}`,{body:{pass_admin:elem.value}}).subscribe({
        next: data => {
            this.workers.splice(id,1);
            this.delete=0;
            this.loading=false;
            this.success_message="Usunięto użytkownika";
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
            this.error_message = error.error.message;
            console.error('There was an error!', error);
            this.delete=0;
            this.loading=false;
            this.success_message="";
            this.changeDetectorRef.detectChanges();
            return;
        }
      })
  }
}
