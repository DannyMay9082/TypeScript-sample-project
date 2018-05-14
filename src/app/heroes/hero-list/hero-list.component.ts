import {Component, OnInit, ViewChild} from '@angular/core';
import {Hero} from '../shared/hero.model';
import {HeroService} from '../shared/hero.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {AppConfig} from '../../config/app.config';
import {Router} from '@angular/router';
import {LoggerService} from '../../core/shared/logger.service';

@Component({
  selector: 'app-remove-hero-dialog',
  templateUrl: './remove-hero.dialog.html',
})

export class RemoveHeroDialogComponent {
  constructor() {
  }
}

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss']
})

export class HeroListComponent implements OnInit {

  heroes: Hero[];
  newHeroForm: FormGroup;
  canVote = false;
  error: string;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private heroService: HeroService,
              private dialog: MatDialog,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.canVote = HeroService.checkIfUserCanVote();

    this.newHeroForm = this.formBuilder.group({
      'name': new FormControl('', [Validators.required]),
      'alterEgo': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.heroService.getHeroes().subscribe((heroes: Array<Hero>) => {
      this.heroes = heroes.sort((a, b) => {
        return b.likes - a.likes;
      });
    });
  }

  like(hero: Hero) {
    this.heroService.like(hero).subscribe(() => {
      this.canVote = HeroService.checkIfUserCanVote();
    }, (error: Response) => {
      LoggerService.error('maximum votes limit reached', error);
    });
  }

  createNewHero(newHero: Hero) {
    this.heroService.createHero(newHero).subscribe((newHeroWithId) => {
      this.heroes.push(newHeroWithId);
      this.myNgForm.resetForm();
    }, (response: Response) => {
      if (response.status === 500) {
        this.error = 'errorHasOcurred';
      }
    });
  }

  seeHeroDetails(hero): void {
    if (hero.default) {
      this.router.navigate([AppConfig.routes.heroes + '/' + hero.id]);
    }
  }

  remove(heroToRemove: Hero): void {
    const dialogRef = this.dialog.open(RemoveHeroDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.deleteHeroById(heroToRemove.id).subscribe(() => {
          this.heroService.showSnackBar('heroRemoved');
          this.heroes = this.heroes.filter(hero => hero.id !== heroToRemove.id);
        }, (response: Response) => {
          if (response.status === 500) {
            this.error = 'heroDefault';
          }
        });
      }
    });
  }
}
