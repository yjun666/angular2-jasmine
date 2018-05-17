import { Component, OnInit } from '@angular/core';
import { log } from 'util';
import { AppService } from './app.service';
declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    public appService: AppService,
  ) {

  }
  ngOnInit() {
    this.appService.getValue();
  }
  showdropdownlist() {
    $('.dropdown-main').show();
  }
  hidedropdownlist() {
    $('.dropdown-main').hide();
  }
}
