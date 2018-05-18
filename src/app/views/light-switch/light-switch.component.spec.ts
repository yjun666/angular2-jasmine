import { TestBed } from '@angular/core/testing';
import { LightSwitchComponent } from './light-switch.component';
import { LightSwitchService } from './light-switch.service';
import { AppComponent } from '../../app.component';
import { AppService } from '../../app.service';

// 单独测试组件类

// 测试单独的组件，不带有依赖注入和引入外部服务，没有Input和outPut 测试时需要把依赖注释掉
describe('LightswitchComp', () => {
    it('#clicked() should toggle #isOn', () => {
        const comp = new LightSwitchComponent(null);
        expect(comp.isOn).toBe(false, 'off at first');
        comp.clicked();
        expect(comp.isOn).toBe(true, 'on after click');
        comp.clicked();
        expect(comp.isOn).toBe(false, 'off after second click');
    });

    it('#clicked() should set #message to "is on"', () => {
        const comp = new LightSwitchComponent(null);
        expect(comp.message).toMatch(/is off/i, 'off at first');
        comp.clicked();
        expect(comp.message).toMatch(/is on/i, 'on after clicked');
    });
});


// testOutPut 当组件有output事件时 测试时需要把依赖注释掉
describe('testOutPut', () => {
    const comp = new LightSwitchComponent(null);
    const app = new AppComponent(null);
    it('TestOutPut click 参数abc', () => {
        // 判断output事件传入的参数是否是想要的参数
        comp.selected.subscribe(abc => expect(abc).toBe('abc'));
        // 调用事件以传入参数进行判断
        comp.testOutPut();
    });
    it('TestOutPut click 参数aaaabc', (done) => {
        // 判断output事件传入的参数是否是想要的参数
        comp.selected.subscribe(abc => expect(abc).toBe('aaaabc'));
        // 调用事件以传入参数进行判断
        comp.testOutPut();
    });
});

class MockUserService {
    isLoggedIn = true;
    user = { name: 'Test User' };
}

// 测试带有依赖的组件  需要使用TestBed注入依赖
describe('单独测试组件类引入依赖的服务', () => {
    let lightSwitchService: LightSwitchService;
    let comp;
    beforeEach(() => {
        TestBed.configureTestingModule({
            // provide the component-under-test and dependent service
            providers: [
                LightSwitchComponent,
                { provide: LightSwitchService, useClass: MockUserService }
            ]
        });
        // inject both the component and the dependent service.
        comp = TestBed.get(LightSwitchComponent);
        lightSwitchService = TestBed.get(LightSwitchService);
    });
    it('should not have welcome message after construction', () => {
        expect(comp.welcome).toBeUndefined();
    });

    it('should welcome logged in user after Angular calls ngOnInit', (done) => {
        comp.ngOnInit();
        expect(comp.welcome).toContain(lightSwitchService.user.name);
        done();
    });

    it('should ask user to log in if not logged in after ngOnInit', () => {
        lightSwitchService.isLoggedIn = false;
        comp.ngOnInit();
        expect(comp.welcome).not.toContain(lightSwitchService.user.name);
        expect(comp.welcome).toContain('log in');
    });
});
