import { Component, OnInit } from '@angular/core';
import { log } from 'util';
import { AppService } from './app.service';

declare var Swiper: any;
declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  mySwiper;
  constructor(
    public appService: AppService,
  ) {

  }
  ngOnInit() {
    this.appService.getValue();
    this.mySwiper = new Swiper('.swiper-container', {
      autoplay: 1000,
      // direction: 'vertical',
      direction: 'horizontal',
      loop: true,

      // 如果需要分页器
      pagination: '.swiper-pagination',

      // 如果需要前进后退按钮
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',

      // 如果需要滚动条
      scrollbar: '.swiper-scrollbar',
    });
    this.mySwiper.slideTo(2, 1000, false);
  }
  // output
  lightSwtch(abc) {
    console.log('asdflkj');
  }


}
