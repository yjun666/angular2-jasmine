import { Injectable } from '@angular/core';

import { ValueService } from './value.service';
import { FakeValueService } from './fakevalue.service';
@Injectable()
export class AppService {
    constructor(
        public valueService: ValueService,
        public fakeValueService: FakeValueService,
    ) { }
    getValue() {
        this.fakeValueService.getValue();
    }
}
