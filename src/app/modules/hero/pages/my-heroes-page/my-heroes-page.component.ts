import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Hero } from '../../shared/hero.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HeroRemoveComponent } from '../../components/hero-remove/hero-remove.component';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { ROUTES_CONFIG } from '../../../../configs/routes.config';
import { CookieService } from '@gorniv/ngx-universal';
import { HeroService } from '../../../core/services/hero.service';
import { UtilsHelperService } from '../../../core/services/utils-helper.service';

@Component({
  selector: 'app-my-heroes-page',
  templateUrl: './my-heroes-page.component.html',
  styleUrls: ['./my-heroes-page.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {
      params: { timing: 1, delay: 0 }
    }))])
  ]
})

export class MyHeroesPageComponent implements OnInit {

  heroes: Hero[];
  newHeroForm: FormGroup;
  canVote = false;
  error: boolean;

  @ViewChild('form', { static: false }) myNgForm; // just to call resetForm method

  constructor(private heroService: HeroService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private formBuilder: FormBuilder,
              private cookieService: CookieService,
              @Inject(ROUTES_CONFIG) public routesConfig: any) {
    this.canVote = this.heroService.checkIfUserCanVote();

    this.newHeroForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      alterEgo: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });

    this.onChanges();
  }

  ngOnInit() {
    this.heroService.getHeroes().subscribe((heroes: Array<Hero>) => {
      this.heroes = heroes;
    });
  }

  async createNewHero() {
    if (this.newHeroForm.valid) {
      this.heroService.createHero(new Hero(this.newHeroForm.value)).then(() => {
        this.myNgForm.resetForm();
        this.snackBar.open('Hero created', '', { duration: 1000 });
      }, () => {
        this.error = true;
      });
    }
  }

  like(hero: Hero) {
    this.canVote = this.heroService.checkIfUserCanVote();
    if (this.canVote) {
      hero.like();
      this.cookieService.put('votes', '' + (Number(this.cookieService.get('votes') || 0) + 1));
      this.heroService.updateHero(hero);
    } else {
      this.snackBar.open('Can\'t vote anymore', '', { duration: 1000 });
    }
  }

  deleteHero(hero: Hero) {
    const dialogRef = this.dialog.open(HeroRemoveComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.deleteHero(hero.id).then(() => {
          this.heroService.showSnackBar('Hero removed');
        }, () => {
          this.error = true;
        });
      }
    });
  }

  trackByFn(index: any) {
    return index;
  }

  private onChanges() {
    this.newHeroForm.get('name').valueChanges.subscribe((value) => {
      if (value && value.length >= 3 && UtilsHelperService.isPalindrome(value)) {
        this.snackBar.open('Yeah that\'s a Palindrome!', '', { duration: 2000 });
      } else {
        this.snackBar.dismiss();
      }
    });
  }
}
