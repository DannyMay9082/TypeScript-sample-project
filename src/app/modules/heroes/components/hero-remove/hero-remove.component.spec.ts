import {HeroRemoveComponent} from './hero-remove.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {configureTestSuite} from 'ng-bullet';
import {TestsModule} from '../../../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';

describe('HeroRemoveComponent', () => {
  let component: HeroRemoveComponent;
  let fixture: ComponentFixture<HeroRemoveComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        HeroRemoveComponent
      ],
      providers: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroRemoveComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the component', (() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));
});
