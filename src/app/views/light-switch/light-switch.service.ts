import { Injectable } from '@angular/core';

@Injectable()
export class LightSwitchService {
    isLoggedIn = true;
    user = { name: 'Test User' };
    constructor() { }

}
