import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { E404 } from './e404/e404';
import { WorkDone } from './work-done/work-done';
import { Income } from './income/income';
import { Oplacalnosc } from './oplacalnosc/oplacalnosc';
import { Staff } from './staff/staff';
import { Worker } from './worker/worker';
import { UserManagement } from './user-management/user-management';

export const routes: Routes = [
    {path:'', component: Home,data: { hideNavbar: true }},
    {path:'home', component: Home,data: { hideNavbar: true }},
    {path:'login', component: Login,data: { hideNavbar: true }},
    {path:'zadania', component: WorkDone},
    {path:'faktury', component: Income},
    {path:'oplacalnosc', component: Oplacalnosc},
    {path:'pracownicy', component: Staff},
    {path:'pracownicy/:id', component: Worker},
    {path:'kadra', component: UserManagement},

    {path:'**', component: E404,data: { hideNavbar: true }}

];
