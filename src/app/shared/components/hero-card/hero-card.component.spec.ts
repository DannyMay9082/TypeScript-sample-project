import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroCardComponent} from './hero-card.component';
import {HeroService} from '../../../modules/heroes/shared/hero.service';
import {AppConfig} from '../../../configs/app.config';
import {TestsModule} from '../../modules/tests.module';
import {Hero} from '../../../modules/heroes/shared/hero.model';
import {TranslateModule} from '@ngx-translate/core';
import {configureTestSuite} from 'ng-bullet';

describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        HeroCardComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should like a hero', () => {
    fixture.detectChanges();
    localStorage.setItem('votes', String(AppConfig.votesLimit - 1));
    const hero = new Hero({likes: 1});
    hero.like();
    expect(hero.likes).toBe(2);
  });

  it('should not like a hero', () => {
    fixture.detectChanges();
    localStorage.setItem('votes', String(AppConfig.votesLimit));
    expect(HeroService.checkIfUserCanVote()).toBe(false);
  });
});
