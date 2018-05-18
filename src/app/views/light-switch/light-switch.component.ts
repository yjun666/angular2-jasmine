import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LightSwitchService } from './light-switch.service';

declare const $: any;
@Component({
    selector: 'app-lightswitch',
    templateUrl: './light-switch.component.html',
    styleUrls: ['./light-switch.component.scss']
})
export class LightSwitchComponent implements OnInit {
    isOn = false;
    welcome;
    @Output() selected = new EventEmitter();
    clicked() { this.isOn = !this.isOn; }
    get message() {
        return `The light is ${this.isOn ? 'On' : 'Off'}`;
    }

    constructor(
        public lightSwitchService: LightSwitchService
    ) {

    }

    ngOnInit() {
        this.welcome = this.lightSwitchService.isLoggedIn ?
            'Welcome, ' + this.lightSwitchService.user.name : 'Please log in.';
    }

    testOutPut() {
        this.selected.emit('abc');
    }
}
