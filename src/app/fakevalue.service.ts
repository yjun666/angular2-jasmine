import { Injectable } from '@angular/core';
import { ValueService } from './value.service';
@Injectable()
export class FakeValueService {
    page: number = 1;
    constructor(
        public valueService: ValueService,
    ) { }
    getValue() {
        this.valueService.getValue();
        const aa = this.valueService.getValue();
        console.log(aa);
    }
}
