import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RoseSystem');
  ngOnInit(){
    sessionStorage.setItem("apiURL","http://localhost/backend/api")
    //https://brudwawa.duckdns.org/api  https://localhost:8000/api
  }
  showNavbar = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute.firstChild;

        while (route?.firstChild) {
          route = route.firstChild;
        }

        this.showNavbar = !route?.snapshot.data['hideNavbar'];
      });
  }
}
