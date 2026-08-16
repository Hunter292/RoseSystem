import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth';
import { TokenStorageService } from '../core/token-storage';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private http = inject(HttpClient);
  error_message:String="";
  success_message:String="";
  loading:boolean=false;
  inputForm: FormGroup;
  data:any;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenStorageService,
    
  ){
    this.inputForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',],
      pass: ['',Validators.required],
    });
    
  }
  ngOnInit(){
    this.authService.check_login();
    this.data=this.tokenService.getUser();
    this.inputForm.get("email")?.setValue(this.data.email);
  }
  async patch_worker(){
    if (this.inputForm.invalid){
      if(this.inputForm.get('email')?.hasError('email') || this.inputForm.get('email')?.hasError('required')) this.error_message="Nieprawidłowy mail";
      if(this.inputForm.get("pass")?.hasError('required')) this.error_message="Proszę wpisać hasło";
      this.changeDetectorRef.detectChanges();
      return;
    }
    const {email,password,pass}=this.inputForm.value;
    if(password && password.length<7){
      this.error_message="Hasło jest za krótkie";
      this.changeDetectorRef.detectChanges();
      return;
    }
    const pattern=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(!pattern.test(email)){
      this.success_message="";
      this.error_message="Nieprawidłowy email";
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.loading = true;
    this.http.patch<any>(`${sessionStorage.getItem("apiURL")}/register/`, {password:password,email:email,pass:pass
      }).subscribe({
          next: data => {
              this.error_message="";
              this.success_message="Zmieniono użytkownika"
              this.loading=false;
              this.inputForm.reset();
              if(password) this.new_token(email,password)
              else this.new_token(email,pass)
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
  }
  new_token(email:string, pass:string){
    this.authService.login(email,pass).subscribe({
      next: (user) => {
        this.inputForm.get("email")?.setValue(user.email);
      },
      error: (error) => {
        this.loading = false;
        this.error_message="Error";
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
