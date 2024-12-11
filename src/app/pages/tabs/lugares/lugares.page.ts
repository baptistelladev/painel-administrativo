import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ICity } from 'src/app/shared/models/ICity';
import { CidadesPage } from '../cidades/cidades.page';
import { Store } from '@ngrx/store';
import * as AppStore from './../../../shared/store/app.state';
import { CityEnum } from 'src/app/shared/enums/City';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.page.html',
  styleUrls: ['./lugares.page.scss'],
})
export class LugaresPage implements OnInit, OnDestroy {

  public currentCity: ICity;
  public currentCity$: Observable<ICity>;
  public currentCitySubscription: Subscription;

  constructor(
    public modalCtrl : ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.getCurrentCityFromNGRX();
  }

  public getCurrentCityFromNGRX(): void {
    this.currentCity$ = this.store.select(AppStore.selectAppCurrentCity);

    this.currentCitySubscription = this.currentCity$
    .subscribe((city: ICity) => {
      this.currentCity = city;
    })
  }

  ngOnDestroy() {
    this.currentCitySubscription.unsubscribe();
  }

}
