import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ModalModule } from 'ngx-bootstrap/modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { NavComponent } from './nav/nav.component';
import {DateTimeFormatPipePipe} from './_helps/DateTimeFormatPipe.pipe';
import { EventoService } from './_services/evento.service';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent, EventosComponent, NavComponent, DateTimeFormatPipePipe],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule,
     BrowserAnimationsModule,
     FormsModule,
     BsDropdownModule.forRoot(),
     BsDatepickerModule.forRoot(),
     TooltipModule.forRoot(),
     ModalModule.forRoot(),
     ToastrModule.forRoot({
       timeOut: 10000,
       positionClass: 'toast-bottom-right',
       preventDuplicates: true,
     }),
     ReactiveFormsModule
  ],
  providers: [EventoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
