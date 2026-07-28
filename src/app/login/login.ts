import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  
})
@Injectable({providedIn: 'root'})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  returnUrl: string = '';
  loading = false;
  private http = inject(HttpClient);
   constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, /*Validators.email*/]],
      password: ['', Validators.minLength(4)],
    });


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }
  log_in(){
    if (this.loginForm.invalid){
      if(this.loginForm.get('email')?.hasError('email') || this.loginForm.get('email')?.hasError('required')) this.errorMessage="Invalid email";
      if(this.loginForm.get('password')?.hasError('minlength')|| this.loginForm.get('password')?.hasError('required')) this.errorMessage="Password is too short";
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.loading = true;

    const { email, password} = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.router.navigateByUrl(this.returnUrl);
        
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        this.loginForm.get('password')?.reset();
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
    
  }
}
