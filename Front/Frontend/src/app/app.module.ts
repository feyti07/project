import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { ListDemandeComponent } from './pages/list-demande/list-demande.component';
import { ListReclamationComponent } from './pages/list-reclamation/list-reclamation.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmRegisterComponent } from './pages/confirm-register/confirm-register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { MainAdminPageComponent } from './main-admin-page/main-admin-page.component';
import { AjoutDemandeComponent } from './pages/ajout-demande/ajout-demande.component';
import { HttpInterceptorService } from '../services/http-interceptor.service';
import { SideBarComponent } from './pages/side-bar/side-bar.component';
import { DetailsComponent } from './pages/details/details.component';
import { TinymceEditorComponent } from './pages/tinymce-editor-component/tinymce-editor-component.component';
import { MessageComponent } from './pages/message-component/message-component.component';
import { HistoriqueComponent } from './pages/historique/historique.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { PasswordComponent } from './pages/mini/password/password.component';
import { InfoComponent } from './pages/mini/info/info.component';
import { StatistiqueComponent } from './pages/statistique/statistique.component';
import { ListAcceeComponent } from './pages/list-accee/list-accee.component';
import { NavComponent } from './pages/nav/nav.component';
import { PaginationComponent } from './pages/pagination/pagination.component';
import { AjoutReclamationComponent } from './pages/ajout-reclamation/ajout-reclamation.component';
import { SettingsComponent } from './pages/settings/settings.component';

import { ChartModule } from 'angular-highcharts';
import { ChatComponent } from './pages/chat/chat.component';
import { UserDashComponent } from './pages/USER/user-dash/user-dash.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { NavUserComponent } from './pages/USER/nav-user/nav-user.component';
import { ListDemandeUserComponent } from './pages/USER/list-demande-user/list-demande-user.component';
import { NotificationComponent } from './pages/notification/notification.component';
//import { AcceuilUserComponent } from './pages/DashboardUser/acceuil-user/acceuil-user.component';




@NgModule({
  declarations: [
    
    AppComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    ListDemandeComponent,
    ListReclamationComponent,
    ConfirmRegisterComponent,
    AdminDashboardComponent,
    MenuComponent,
    MainAdminPageComponent,
    AjoutDemandeComponent,
    SideBarComponent,
    DetailsComponent,
    TinymceEditorComponent,
    MessageComponent,
    ProfilComponent,
    PasswordComponent,
    InfoComponent,
    StatistiqueComponent,
    ListAcceeComponent,
    HistoriqueComponent,
    NavComponent,
    PaginationComponent,
    AjoutReclamationComponent,
    SettingsComponent,
    ChatComponent,
    UserDashComponent,
    AccessDeniedComponent,
    NavUserComponent,
    ListDemandeUserComponent,
    NotificationComponent
    //AcceuilUserComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule
  ],
  providers: [
    
    provideClientHydration(),
    
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
