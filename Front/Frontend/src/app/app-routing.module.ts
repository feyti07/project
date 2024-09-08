import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ListDemandeComponent } from './pages/list-demande/list-demande.component';
import { ConfirmRegisterComponent } from './pages/confirm-register/confirm-register.component';
import { MainAdminPageComponent } from './main-admin-page/main-admin-page.component';
import { AjoutDemandeComponent } from './pages/ajout-demande/ajout-demande.component';
import { TokenGuardService } from '../services/guard/token-guard/token-guard.service';
import { AdminGuardService } from '../services/guard/admin-guard/admin-guard.service';
import { DetailsComponent } from './pages/details/details.component';
import { MessageComponent } from './pages/message-component/message-component.component';
import { HistoriqueComponent } from './pages/historique/historique.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { InfoComponent } from './pages/mini/info/info.component';
import { PasswordComponent } from './pages/mini/password/password.component';
import { ListAcceeComponent } from './pages/list-accee/list-accee.component';
import { StatistiqueComponent } from './pages/statistique/statistique.component';
import { AjoutReclamationComponent } from './pages/ajout-reclamation/ajout-reclamation.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChatComponent } from './pages/chat/chat.component';
import { UserDashComponent } from './pages/USER/user-dash/user-dash.component';
import { UserGuard } from '../services/guard/User-guard/user.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { RoleGuard } from '../services/guard/role.guard';
import { ListDemandeUserComponent } from './pages/USER/list-demande-user/list-demande-user.component';
import { NotificationComponent } from './pages/notification/notification.component';

//import { AcceuilUserComponent } from './pages/DashboardUser/acceuil-user/acceuil-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: HomeComponent },
  {
    path: 'dashuser',
    component: UserDashComponent,
    canActivate: [TokenGuardService, RoleGuard],
    data: { expectedRoles: ['ROLE_USER'] }
  },
  { path: 'dash',
    component: DashboardComponent,
    canActivate : [TokenGuardService, AdminGuardService] },
   {path: 'access-denied', component: AccessDeniedComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'listD', component: ListDemandeComponent },
  { path: 'confirm-register', component: ConfirmRegisterComponent },
  { path: 'admin', component: MainAdminPageComponent },
  { path: 'create', component: AjoutDemandeComponent },
  { path: 'new-demande/:demande-id',component: AjoutDemandeComponent },
  { path: 'new-demande',component: AjoutDemandeComponent },
  { path: 'detail/:id', component: DetailsComponent },
  { path: 'message/:userId', component: MessageComponent},
  { path: 'histo/:demandeId', component: HistoriqueComponent },
  { path: 'profil', component: ProfilComponent},
  {path: 'info', component:InfoComponent },
  {path: 'pass', component: PasswordComponent},
  {path: 'listAccee', component:ListAcceeComponent},
  {path:'home', component:HomeComponent},
  {path:'statistic', component:StatistiqueComponent},
  { path: 'createR', component: AjoutReclamationComponent },
  { path: 'new-reclamation/:reclamation-id',component: AjoutReclamationComponent },
  {path: 'settings', component: SettingsComponent},
  { path: 'chat/:demandeId', component: ChatComponent },
  {path:'userdash', component: UserDashComponent},
  {path: 'listuser', component: ListDemandeUserComponent},
  {path: 'not', component: NotificationComponent}

 

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
