import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularDraggableModule } from 'angular2-draggable';


import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ValueService } from './value.service';
import { FakeValueService } from './fakevalue.service';

import { BannerComponent } from './banner/banner.component';

const allProvides = [
  AppService,
  ValueService,
  FakeValueService
];

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent
  ],
  imports: [
    BrowserModule,
    AngularDraggableModule
  ],
  providers: [...allProvides],
  bootstrap: [AppComponent]
})
export class AppModule { }
