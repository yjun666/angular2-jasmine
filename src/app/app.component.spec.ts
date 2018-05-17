import { TestBed } from '@angular/core/testing';
import { FakeValueService } from './fakevalue.service';
import { ValueService } from './value.service';
import { AppService } from './app.service';

// TestBed 测试不引入依赖测试服务
// describe('ValueService', () => {
//   let ValueService: ValueService;
//   beforeEach(() => {
//     TestBed.configureTestingModule({ providers: [ValueService] });
//     ValueService = TestBed.get(ValueService);
//   });

//   it('ValueService', (done) => {
//     console.log(ValueService.getValue());
//     expect(ValueService.getValue()).toEqual(2);
//     // 不添加done会报错,不知道为啥
//     done();
//   });
// });


// TestBed 测试引入依赖测试服务  spy 注入间谍的方式mock
describe('fakeValueService', () => {
    let fakeValueService: FakeValueService;
    let valueServiceSpy: jasmine.SpyObj<ValueService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ValueService', ['getValue']);
        TestBed.configureTestingModule({
            providers: [
                FakeValueService, { provide: ValueService, useValue: spy }
            ]
        });
        fakeValueService = TestBed.get(FakeValueService);
        valueServiceSpy = TestBed.get(ValueService);
    });

    it('ValueService', (done) => {
        // valueServiceSpy.getValue.and.returnValue(2);
        console.log(fakeValueService.getValue());
        expect(fakeValueService.getValue()).toEqual(2);
        // 不添加done会报错,不知道为啥
        done();
    });
});


