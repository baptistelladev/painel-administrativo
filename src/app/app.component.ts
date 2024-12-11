import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr'
import { StorageService } from './core/services/storage.service';
import { ICity } from './shared/models/ICity';
import { Platform } from '@ionic/angular';
import { CURRENT_CITY } from './shared/consts/keys';
import { MOCK_CITIES } from './shared/mocks/MockCities';
import { Store } from '@ngrx/store';
moment.locale('pt')
import * as AppStore from './shared/store/app.state'
import { CityEnum } from './shared/enums/City';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public currentCity: ICity;

  public MOCK_CITIES: ICity[] = MOCK_CITIES;

  constructor(
    private storageService : StorageService,
    private platform : Platform,
    private store : Store
  ) {
  }

  async ngOnInit() {
    await this.platform.ready()
    .then(async (res: string) => {
      await this.storageService.createStorage();

      await this.storageService.getStorageKey(CURRENT_CITY).then((res: string) => {
        if (res === null || !res) {

          let foundCity = this.MOCK_CITIES.find((city: ICity) => {
            return city.value === CityEnum.SANTOS;
          })

          if (foundCity) {
            this.currentCity = foundCity;
          }

          this.storageService.setStorageKey(CURRENT_CITY, this.currentCity.value)
          this.store.dispatch(AppStore.setCurrentCity({ city: this.currentCity }));

        } else {
          let foundCity = this.MOCK_CITIES.find((city: ICity) => {
            return city.value === res;
          })

          if (foundCity) {
            this.currentCity = foundCity;
          }

          this.storageService.setStorageKey(CURRENT_CITY, this.currentCity.value)
          this.store.dispatch(AppStore.setCurrentCity({ city: this.currentCity }));
        }
      })
    })
  }
}
