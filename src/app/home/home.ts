import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../core/token-storage';
import { AuthService } from '../core/auth';

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
    private authService: AuthService,
  ){}
  is_admin=true;
  logged:boolean=false;

  ngOnInit(){
    this.authService.check_login();
    this.is_admin=this.tokenService.getUser()?.admin;
  }
  to_timer(){
    this.router.navigate(['/timer']);
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
    this.router.navigate(['/kadry']);
  }
  to_profile(){
    this.router.navigate(['/profil']);
  }
}
