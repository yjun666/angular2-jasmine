import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';

describe('BannerComponent (minimal)', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let bannerElement: HTMLElement;
  beforeEach(() => {
    // 使用testBed创建组件
    TestBed.configureTestingModule({
      declarations: [BannerComponent]
    });
    fixture = TestBed.createComponent(BannerComponent); // 创建组件的实例
    // 生成的是组件，调用ts中事件和参数需要通过这个来调用，不能使用bannerElement，bannerElement获取的是dom节点
    component = fixture.componentInstance;
  });

  // ComponentFixture 是一个测试挽具（就像马车缰绳），用来与所创建的组件及其 DOM 元素进行交互。
  // 可以通过测试夹具（fixture）来访问该组件的实例，并用 Jasmine 的 expect 语句来确保其存在。
  it('should create', () => {
    expect(component).toBeDefined(); // 直接用下行代码即可

    bannerElement = fixture.nativeElement; // 获取原生dom结构
    console.log(bannerElement); // 打印的是整个bannerComponent的Dom结构
    expect(bannerElement).toBeDefined(); // 判断组件是否存在
  });

  // 现在，添加一个测试，用它从 fixture.nativeElement 中获取组件的元素，并查找是否存在所预期的文本内容。
  it('should contain "banner works!"', () => {
    bannerElement = fixture.nativeElement; // 获取原生dom结构
    console.log(bannerElement); // 打印的是整个bannerComponent的Dom结构
    expect(bannerElement.textContent).toContain('banner works!'); // 判断当前文本是不是包含这段文本
  });

  // nativeElement 下面这个测试就会调用 HTMLElement.querySelector 来获取 <p> 元素，并在其中查找 Banner 文本：
  it('should have <p> with "banner works!"', () => {
    bannerElement = fixture.nativeElement; // 获取原生dom结构
    console.log(bannerElement); // 打印的是整个bannerComponent的Dom结构
    const p = bannerElement.querySelector('p');
    expect(p.textContent).toEqual('banner works!');
  });

  it('click change message', () => {
    component.changeMessageContent();
    expect(component.message).toEqual('message');

  });
});

// DebugElement
// 上边太多了，写不开了
describe('DebugElement', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let bannerElement: HTMLElement;
  beforeEach(() => {
    // 使用testBed创建组件
    TestBed.configureTestingModule({
      declarations: [BannerComponent]
    });
    fixture = TestBed.createComponent(BannerComponent); // 创建组件的实例
    component = fixture.componentInstance;
    bannerElement = fixture.nativeElement;
  });

  // it('', () => {

  // });




});
