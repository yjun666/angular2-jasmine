import { Injectable } from '@angular/core';

@Injectable()
export class ValueService {
    page: number = 2;
    constructor(
    ) { }
    getValue() {
        console.log('test app2Service');
        return this.page;
    }
}
