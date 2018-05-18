import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularDraggableModule } from 'angular2-draggable';


import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ValueService } from './value.service';
import { FakeValueService } from './fakevalue.service';


import { BannerComponent } from './views/banner/banner.component';
import { LightSwitchComponent } from './views/light-switch/light-switch.component';
import { LightSwitchService } from './views/light-switch/light-switch.service';

const allProvides = [
  AppService,
  ValueService,
  FakeValueService,
  LightSwitchService
];

@NgModule({
  declarations: [
    AppComponent,
    LightSwitchComponent,
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
