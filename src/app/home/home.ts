import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../core/token-storage';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
    
  ){}
  is_admin=true;
  logged:boolean=false;

  ngOnInit(){
    if(!sessionStorage.getItem("logged")) this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }});
    if(sessionStorage.getItem("logged")) this.logged=true;
    if(this.logged)this.is_admin=this.tokenService.getUser()?.admin;
  }
  to_task(){
    this.router.navigate(['/zadania']);
  }
  to_mailer(){
    this.router.navigate(['/wyliczenia']);
  }
  to_stats(){
    this.router.navigate(['/oplacalnosc']);
  }
  log_out(){
    this.tokenService.clear();
    this.router.navigate(['/login'])
  }
  to_workers(){
    this.router.navigate(['/pracownicy']);
  }
  to_income(){
    this.router.navigate(['/faktury']);
  }
  to_hr(){
    this.router.navigate(['/kadra']);
  }
}
