import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, NgModel } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Third party
import { AlertModule } from 'ngx-bootstrap';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpClientModule } from '@ngx-progressbar/http-client';
import { TableModule } from 'ngx-easy-table';

// ngx-bootstrap
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from "ngx-bootstrap/pagination"; //Dependency for ng2-table
import { PopoverModule } from 'ngx-bootstrap/popover';
//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from 'ngx-icons';

// API
import { UserService } from './api/user.service';
import { UserAuthService } from './api/user-auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';

import { AlertService } from './services/alert.service';
import { AlertComponent } from './services/alert/alert.component';

// Our custom components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppUserComponent } from './app-user/app-user.component';
import { AppUserTableComponent } from './app-user/app-user-table/app-user-table.component';
import { UserTableComponent } from './app-user/user-table/user-table.component';
import { AppOrsComponent } from './app-ors/app-ors.component';
import { AppChildComponent } from './app-ors/app-child/app-child.component';
import { AppRoutingModule } from './app-routing.module';
import { DummyComponent } from './dummy/dummy.component';

import { DataService } from './app-ors/data.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AppUserComponent,
    AppUserTableComponent,
    UserTableComponent,
    AppOrsComponent,
    AppChildComponent,
    DummyComponent,
    AuthComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AlertModule.forRoot(),
    NgProgressModule.forRoot(),
    NgProgressHttpClientModule,
    BsDropdownModule.forRoot(),
    CollapseModule,
    PopoverModule.forRoot(),
    FontAwesomeModule,
    PaginationModule.forRoot(),
    TableModule,
    AppRoutingModule
    //NgbModule.forRoot()
  ],
  providers: [UserService,
              UserAuthService,
              DataService,
              Title,
              { provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true},
              AlertService,
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
