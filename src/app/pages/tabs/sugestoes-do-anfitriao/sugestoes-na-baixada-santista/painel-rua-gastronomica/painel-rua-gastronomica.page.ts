import { EstablishmentModalComponent } from '../../../../../components/modais/establishment-modal/establishment-modal.component';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { map, Observable, Subscription } from 'rxjs';
import { IPlace } from 'src/app/shared/models/IPlace';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Store } from '@ngrx/store';
import * as AppStore from '../../../../../shared/store/app.state';
import Swiper from 'swiper';
import { PlacesService } from 'src/app/core/services/firebase/places.service';
import { SuggestionsEnum } from 'src/app/shared/enums/Suggestions';

@Component({
  selector: 'app-painel-rua-gastronomica',
  templateUrl: './painel-rua-gastronomica.page.html',
  styleUrls: ['./painel-rua-gastronomica.page.scss'],
})
export class PainelRuaGastronomicaPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('establishmentsSwiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  public hideRightControl: boolean = false;
  public hideLeftControl: boolean = false;

  public lenghts_to_save_time: {
    list: IPlace[],
    establishment_type: string,
    text: any,
    length: number,
    plural: any
  }[] = [
    {
      list: [],
      establishment_type: 'ADEGA',
      length: 0,
      text: {
        pt: 'Adega',
        en: 'Wine Cellar',
        es: 'Bodega'
      },
      plural: {
        pt: 'Adegas',
        en: 'Wine Cellars',
        es: 'Bodegas'
      }
    },
    {
      list: [],
      establishment_type: 'DOCERIA',
      length: 0,
      text: {
        pt: 'Doceria',
        en: 'Confectionery',
        es: 'Dulcería'
      },
      plural: {
        pt: 'Docerias',
        en: 'Confectioneries',
        es: 'Dulcerías'
      }
    },
    {
      list: [],
      establishment_type: 'EMPORIO',
      length: 0,
      text: {
        pt: 'Empório',
        en: 'Emporium',
        es: 'Empore'
      },
      plural: {
        pt: 'Empórios',
        en: 'Emporiums',
        es: 'Emporios'
      }
    },
    {
      list: [],
      establishment_type: 'HAMBURGUERIA',
      length: 0,
      text: {
        pt: 'Hamburgueria',
        en: 'Burger Joint',
        es: 'Hamburguesería'
      },
      plural: {
        pt: 'Hamburguerias',
        en: 'Burger Joints',
        es: 'Hamburgueserías'
      }
    },
    {
      list: [],
      establishment_type: 'BAR',
      length: 0,
      text: {
        pt: 'Bar',
        en: 'Bar',
        es: 'Bar'
      },
      plural: {
        pt: 'Bares',
        en: 'Bars',
        es: 'Bares'
      }
    },
    {
      list: [],
      establishment_type: 'RESTAURANTE',
      length: 0,
      text: {
        pt: 'Restaurante',
        en: 'Restaurant',
        es: 'Restaurante'
      },
      plural: {
        pt: 'Restaurantes',
        en: 'Restaurants',
        es: 'Restaurantes'
      }
    },
    {
      list: [],
      establishment_type: 'PIZZARIA',
      length: 0,
      text: {
        pt: 'Pizzaria',
        en: 'Pizzeria',
        es: 'Pizzería'
      },
      plural: {
        pt: 'Pizzarias',
        en: 'Pizzerias',
        es: 'Pizzerías'
      }
    },
    {
      list: [],
      establishment_type: 'CAFETERIA',
      length: 0,
      text: {
        pt: 'Cafeteria',
        en: 'Cafeteria',
        es: 'Cafetería'
      },
      plural: {
        pt: 'Cafeterias',
        en: 'Cafeterias',
        es: 'Cafeterías'
      }
    }
  ]

  public establishments: IPlace[];
  public establishments$: Observable<IPlace[]>;
  public establishmentsSubscription: Subscription;

  constructor(
    private placesService : PlacesService,
    private modalCtrl : ModalController,
    private utilsService : UtilsService,
    private store : Store,
    private alertCtrl : AlertController,
    private toastCtrl : ToastController,
    private navCtrl : NavController
  ) { }

  ngOnInit() {
    this.getEstablimentsFromGastronomicStreet();
  }

  ngAfterViewInit(): void {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  public back(): void {
    this.navCtrl.back();
  }

  public getEstablimentsFromGastronomicStreet() {
    this.establishments$ = this.placesService
    .getPlacesCollection(
      CollectionsEnum.PLACES,
      [
        { field: 'suggestions', operator: 'array-contains', value: SuggestionsEnum.RUA_GASTRONOMICA_DE_SANTOS }
      ]
    );

    this.establishmentsSubscription = this.establishments$
    .pipe(
      map((establishments: IPlace[]) => {
        this.utilsService.orderByAdressNumberCrescent(establishments);
        return establishments
      })
    )
    .subscribe((establishments: IPlace[]) => {
      this.establishments = establishments;

      this.lenghts_to_save_time = [...this.lenghts_to_save_time].map((option: any) => {
        let list = this.establishments.filter((establishment: IPlace) => {
          return establishment.mainType.value === option['establishment_type'];
        })

        option['list'] = list;
        option['length'] = list.length;

        return option;
      })
    })
  }

  public seeEstablishment(establishment: IPlace): void {
    this.store.dispatch(AppStore.setCurrentEstablishment({ establishment: establishment } ))
    this.openModalToSeeStablishment();
  }

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

  public slideToNext(): void {
    this.swiper?.slideNext(800);

    console.log('teste next');


    if (this.hideLeftControl) {
      this.hideLeftControl = false;
    }

  }

  public slideToPrev(): void {
    this.swiper?.slidePrev(800);

    if (this.hideRightControl) {
      this.hideRightControl = false;
    }
  }

  public swiperReachedEnd() {
    this.hideRightControl = true;
  }

  public swiperReachedBeginning() {
    this.hideLeftControl = true;
  }

  public slideSwiperToStart(): void {
    this.swiper?.slideTo(0, 800);
  }

  ngOnDestroy(): void {

  }

}
