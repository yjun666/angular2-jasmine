import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  template: `
    <div>
      banner works!
      <span>{{ message }}</span>
      <p>banner worksss!</p>
      <p>banner works!</p>
      <p>banner works!</p>
    </div>
  `,
  styles: []
})
export class BannerComponent implements OnInit {
  message = '';
  constructor() { }

  ngOnInit() {
  }

  changeMessageContent() {
    this.message = 'message';
  }



}
