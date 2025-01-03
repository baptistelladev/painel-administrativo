import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription, take } from 'rxjs';
import { PlacesService } from 'src/app/core/services/firebase/places.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { MOCK_CITIES } from 'src/app/shared/mocks/MockCities';
import { ICity } from 'src/app/shared/models/ICity';
import { IFilter } from 'src/app/shared/models/IFilter';
import { IFirebaseFilter } from 'src/app/shared/models/IFirebaseFilter';
import { IPlace } from 'src/app/shared/models/IPlace';
import * as AppStore from '../../../../../shared/store/app.state';
import { MOCK_BEACH_FEATURES } from 'src/app/shared/mocks/MockBeachFeatures';
import { EstablishmentModalComponent } from 'src/app/shared/components/modais/establishment-modal/establishment-modal.component';
@Component({
  selector: 'app-lugar-na-praia',
  templateUrl: './lugar-na-praia.page.html',
  styleUrls: ['./lugar-na-praia.page.scss'],
})
export class LugarNaPraiaPage implements OnInit {

  public places: IPlace[] | null;
  public places$: Observable<IPlace[]>;
  public placesSubscription: Subscription;

  public placeTypeOBJ: any;
  public placeType: string;
  public currentCityAsParam: ICity | undefined;
  public currentLocationAsParam: string | undefined;

  public MOCK_CITIES: ICity[] = MOCK_CITIES;
  public MOCK_FILTERS: IFilter[];
  public MOCK_BEACH_FEATURES: any = MOCK_BEACH_FEATURES;

  constructor(
    private store : Store,
    private route : ActivatedRoute,
    private navCtrl : NavController,
    private alertCtrl : AlertController,
    private modalCtrl : ModalController,
    private placesService : PlacesService
  ) { }

  async ngOnInit() {
   await this.getRouter();

    this.getPlaces([
      { field: 'origin.value', operator: '==', value: this.currentCityAsParam?.value },
      { field: 'mainType.value', operator: '==', value: this.placeType },
      { field: 'work_place', operator: 'array-contains-any', value: [this.currentLocationAsParam] }
    ]);
  }

  /**
   * @description Obtém a rota atual, verifica se tem algum parâmetro, guarda em varíaveis e buscar lugares filtrados com base nessas informações.
   */
  public async getRouter(): Promise<boolean> {
    this.route.queryParams
    .pipe(
      take(1),
      map((params) => {
      return params
    }))
    .subscribe((res: any) => {
      this.currentCityAsParam = this.MOCK_CITIES
      .find((city: ICity) => {
        return city.value === res.cidade;
      })

      this.currentLocationAsParam = res.localidade;

    })

    this.route.paramMap
    .pipe(
      take(1),
      map((params: any) => {
      const updatedParams = {
        ...params.params,
        place_type: params.params.place_type.toUpperCase()
      };
      return updatedParams;
    }))
    .subscribe((res: any) => {
      this.placeType = res.place_type;

      this.placeTypeOBJ = this.MOCK_BEACH_FEATURES.places
      .find((placeType: any) => {
        return placeType.value === this.placeType
      })

      return true
    })

    return true
  }

  /**
   * @description Obtém a lista de lugares.
   */
  public getPlaces(filters: IFirebaseFilter[] = []) {
    if (this.currentCityAsParam && this.placeType && this.currentLocationAsParam) {
      this.places$ = this.placesService
      .getPlacesCollection(
        CollectionsEnum.PLACES,
        filters
      );

      this.placesSubscription = this.places$
      .subscribe((places: IPlace[]) => {
        this.places = places;
      })
    }
  }

  /**
   * @description Volta para página anterior.
   */
  public back(): void {
    this.navCtrl.back();
  }

  /**
   * @description Mostra um alerta para confirmar a remoção de um lugar.
   */
  public async showAlertToRemove(establishment: IPlace): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      message: `Confirmar remoção de ${establishment.name}?`,
      subHeader: `${establishment.name}`,
      cssClass: 'anfitrion-alert negative-btn',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Remover',
          role: 'confirm',
          handler: async () => {
            await alert.dismiss();
            await this.placesService.removePlaceDoc(CollectionsEnum.PLACES, establishment.id);
          }
        },
      ]
    })

    await alert.present();

    return alert;
  }

  /**
   * @description Abre o modal com o formulário.
   */
  public async openModalToSeeStablishment(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: EstablishmentModalComponent,
      mode: 'ios',
      cssClass: 'rgs-register',
      id: 'register-short-establishment'
    })

    await modal.present();

    return modal;
  }

  /**
   * @description Guarda o lugar no NGRX e abre o modal com formulário.
   */
  public seeEstablishment(establishment: IPlace): void {
    this.store.dispatch(AppStore.setCurrentEstablishment({ establishment: establishment } ))
    this.openModalToSeeStablishment();
  }
}
