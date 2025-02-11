import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ICity } from 'src/app/shared/models/ICity';
import { Store } from '@ngrx/store';
import * as AppStore from 'src/app/shared/store/app.state';
import { MOCK_LOCATION } from 'src/app/shared/mocks/MockLocation';
import { ILocation } from 'src/app/shared/models/ILocation';
import { LocationEnum } from 'src/app/shared/enums/Location';
import { IPlace } from 'src/app/shared/models/IPlace';
import { MOCK_BEACH_FEATURES } from 'src/app/shared/mocks/MockBeachFeatures';
import { MOCK_CITY_FEATURES } from 'src/app/shared/mocks/MockCityFeatures';
import { PlacesService } from 'src/app/core/services/firebase/places.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { FeaturesEnum } from 'src/app/shared/enums/Features';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.page.html',
  styleUrls: ['./lugares.page.scss'],
})
export class LugaresPage implements OnInit, OnDestroy {

  public cityResume: any[] = [
    {
      length: null,
      title: 'cadastrados',
      sub_title: 'na cidade',
      value: 'LUGARES_CADASTRADOS'
    },
    {
      length: null,
      title: 'premium',
      sub_title: 'na cidade',
      value: 'LUGARES_PREMIUM'
    },
    {
      length: null,
      title: 'free',
      sub_title: 'na cidade',
      value: 'LUGARES_NAO_PREMIUM'
    }
  ]

  public beachResume: any[] = [
    {
      length: null,
      title: 'cadastrados',
      sub_title: 'na praia',
      value: 'LUGARES_CADASTRADOS'
    },
    {
      length: null,
      title: 'premium',
      sub_title: 'na praia',
      value: 'LUGARES_PREMIUM'
    },
    {
      length: null,
      title: 'free',
      sub_title: 'até o momento',
      value: 'LUGARES_NAO_PREMIUM'
    }
  ]

  public currentCity: ICity;
  public currentCity$: Observable<ICity>;
  public currentCitySubscription: Subscription;

  public places: IPlace[] | null;
  public places$: Observable<IPlace[]>;
  public placesSubscription: Subscription;

  public MOCK_LOCATION: ILocation[] = MOCK_LOCATION;
  public MOCK_BEACH_FEATURES: any = MOCK_BEACH_FEATURES;
  public MOCK_CITY_FEATURES: any = MOCK_CITY_FEATURES;

  public LocationEnum = LocationEnum;
  public FeaturesEnum = FeaturesEnum;

  public lookingForPlaces: boolean = false;
  public lookingForPeople: boolean = false;

  public selectedSegment: string = '';
  public FEATURES: any;
  public resume: any[] | null;

  constructor(
    private store : Store,
    private navCtrl : NavController,
    private placesService : PlacesService

  ) { }

  ngOnInit() {
    this.getCurrentCityFromNGRX();
    this.selectInitialSegment(LocationEnum.CIDADE);
  }

  /**
   * @description Obtém a cidade atual guardada no NGRX.
   */
  public getCurrentCityFromNGRX(): void {
    this.currentCity$ = this.store.select(AppStore.selectAppCurrentCity);

    this.currentCitySubscription = this.currentCity$
    .subscribe((city: ICity) => {
      this.currentCity = city;
    })
  }

  /**
   * @description Selecionada o segment inicial (cidade).
   */
  public selectInitialSegment(segmentValue: string) {
    this.selectedSegment = segmentValue;
    this.FEATURES = this.MOCK_CITY_FEATURES;
    this.getPlacesFromCity();
    // MOSTRAR PESSOAS [SOON] this.getPeopleFromCity();
  }

  /**
   * @description Muda as features conforme o segment selecionado.
   */
  public locationChanged(): void {
    this.FEATURES = null;
    this.places = null;
    // MOSTRAR PESSOAS [SOON]  this.people = null;

    if (this.selectedSegment === LocationEnum.PRAIA) {
      this.FEATURES = this.MOCK_BEACH_FEATURES;
      this.getPlacesFromBeach();
      // MOSTRAR PESSOAS [SOON] this.getPeopleFromBeach();
    } else {
      this.FEATURES = this.MOCK_CITY_FEATURES;
      this.getPlacesFromCity();

      // MOSTRAR PESSOAS [SOON]  this.getPeopleFromCity();
    }
  }

  /**
   * @description Define o resumo das features, ou seja, quantos lugares tem em cada feature.
   */
  public defineResume(origin: string, places: IPlace[]): void {
    this.resume = null;
    this.cityResume.forEach((resume: any) => { resume.length = null });
    this.beachResume.forEach((resume: any) => { resume.length = null });

    if (origin === LocationEnum.CIDADE) {
      this.resume = this.cityResume;

      this.cityResume.forEach((resume: any) => {
        if (resume.value === 'LUGARES_CADASTRADOS') {
          resume.length = places.length;
        }

        if (resume.value === 'LUGARES_PREMIUM') {
          resume.length = places.filter((place: IPlace) => {
            return place.isPremium
          }).length
        }

        if (resume.value === 'LUGARES_NAO_PREMIUM') {
          resume.length = places.filter((place: IPlace) => {
            return !place.isPremium
          }).length
        }
      })

    } else {
      this.resume = this.beachResume;
      this.beachResume.forEach((resume: any) => {
        if (resume.value === 'LUGARES_CADASTRADOS') {
          resume.length = places.length;
        }

        if (resume.value === 'LUGARES_PREMIUM') {
          resume.length = places.filter((place: IPlace) => {
            return place.isPremium
          }).length
        }

        if (resume.value === 'LUGARES_NAO_PREMIUM') {
          resume.length = places.filter((place: IPlace) => {
            return !place.isPremium
          }).length
        }
      })
    }
  }

  /**
   * @description Procura lugares de acordo com o segment selecionado.
   */
  public async searchPlace(place: any) {
    if (place.origin === LocationEnum.CIDADE) {
      await this.searchPlaceInTheCity(place);
    } else {
      this.searchPlaceAtTheBeach(place);
    }
  }

  /**
   * @description Direciona para lugares na cidade conforme a categoria selecionada.
   */
  public async searchPlaceInTheCity(place: any) {
    this.navCtrl.navigateForward([`/logado/lugares/na-cidade/${place.route}`], {
      queryParams: {
        localidade: this.selectedSegment,
        cidade: this.currentCity.value
      }
    })
  }

  /**
   * @description Direciona para lugares na praia conforme a categoria selecionada.
   */
  public async searchPlaceAtTheBeach(place: any) {
    this.navCtrl.navigateForward([`/logado/lugares/na-praia/${place.route}`], {
      queryParams: {
        localidade: this.selectedSegment,
        cidade: this.currentCity.value
      }
    })
  }

  /**
   * @description Obtém lista de lugares cadastrados na cidade selecionada e no segmento escolhido (cidade).
   */
  public async getPlacesFromCity() {

    this.lookingForPlaces = true;

    this.places$ = this.placesService
    .getPlacesCollection(
      CollectionsEnum.PLACES,
      [
        { field: 'origin.value', operator: '==', value: this.currentCity.value },
        { field: 'work_place', operator: 'array-contains-any', value: [this.selectedSegment] }
      ]
    );

    this.placesSubscription = this.places$
    .subscribe( async (places: IPlace[]) => {
      this.places = places;

      let compressedInformation = this.places.reduce((acc: any, place) => {
        const key = place.mainType.value.toUpperCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      this.FEATURES.places.forEach((feature: any) => {
        feature.atLeastOneLength = compressedInformation[feature.value] ? compressedInformation[feature.value] : 0
      })

      this.defineResume(LocationEnum.CIDADE, places);

      this.lookingForPlaces = false;
    })
  }

  /**
   * @description Obtém lista de lugares cadastrados na cidade selecionada e no segmento escolhido (praia).
   */
  public async getPlacesFromBeach() {
    this.lookingForPlaces = true;

    this.places$ = this.placesService
    .getPlacesCollection(
      CollectionsEnum.PLACES,
      [
        { field: 'origin.value', operator: '==', value: this.currentCity.value },
        { field: 'work_place', operator: 'array-contains-any', value: [this.selectedSegment] }
      ]
    );

    this.placesSubscription = this.places$
    .subscribe( async (places: IPlace[]) => {
      this.places = places;

      let compressedInformation = this.places.reduce((acc: any, place) => {
        const key = place.mainType.value.toUpperCase();

        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      this.FEATURES.places.forEach((feature: any) => {
        feature.atLeastOneLength = compressedInformation[feature.value] ? compressedInformation[feature.value] : 0

        console.log(feature.atLeastOneLength);
      })

      this.defineResume(LocationEnum.PRAIA, places);

      this.lookingForPlaces = false
    })
  }

  public ngOnDestroy() {
    this.currentCitySubscription.unsubscribe();
  }

}
