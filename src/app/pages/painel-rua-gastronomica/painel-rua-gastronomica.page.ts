import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablishmentsService } from 'src/app/core/services/firebase/establishments.service';
import { RegisterShortEstablishmentModalComponent } from './modais/register-short-establishment-modal/register-short-establishment-modal.component';
import { RegisterShortParkingComponent } from './modais/register-short-parking/register-short-parking.component';
import * as moment from 'moment';
import { IShortParking } from 'src/app/shared/models/IParking';
import { map, Observable, Subscription } from 'rxjs';
import { IShortEstablishment } from 'src/app/shared/models/Establishment';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { UtilsService } from 'src/app/core/services/utils.service';
import { EstablishmentTypeEnum } from 'src/app/shared/enums/EstablishmentType';
import { Store } from '@ngrx/store';
import * as RuaGastronomicaDeSantosStore from './../../shared/store/ruaGastronomicaDeSantos.state';

@Component({
  selector: 'app-painel-rua-gastronomica',
  templateUrl: './painel-rua-gastronomica.page.html',
  styleUrls: ['./painel-rua-gastronomica.page.scss'],
})
export class PainelRuaGastronomicaPage implements OnInit, OnDestroy {



  public lenghts_to_save_time: {
    list: IShortEstablishment[],
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

  public isLoadingLogo: boolean;

  public short_establishments: IShortEstablishment[];
  public establishments$: Observable<IShortEstablishment[]>;
  public establishmentsSubscription: Subscription;

  public today: string = moment().format('LL');

  public LINKS: any[] = [
    {
      text: 'Google',
      subtext: 'Console Firebase',
      href: 'https://console.firebase.google.com/u/5/project/ruagastronomicadesantos-314/overview?hl=pt-br'
    },
    {
      text: 'Google',
      subtext: 'Firestore',
      href: 'https://console.firebase.google.com/u/5/project/ruagastronomicadesantos-314/firestore?hl=pt-br'
    },
    {
      text: 'Google',
      subtext: 'Analytics',
      href: 'https://console.firebase.google.com/u/5/project/ruagastronomicadesantos-314/analytics/app/web:ZmM0NWUwODMtM2NjMS00MThiLTllYmUtZTcyZjI1M2E4Nzcy/streamview/realtime~2Foverview%3Ffpn%3D630646945223?hl=pt-br'
    }
  ]

  constructor(
    private establishmentsService : EstablishmentsService,
    private modalCtrl : ModalController,
    private utilsService : UtilsService,
    private store : Store
  ) { }

  ngOnInit() {
    this.getEstablishments();
  }

  ionViewDidEnter(){

  }

  public async openModalToCreateStablishment(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: RegisterShortEstablishmentModalComponent,
      mode: 'ios',
      cssClass: 'rgs-register',
      id: 'register-short-establishment'
    })

    await modal.present();

    return modal;
  }

  public async openModalToCreateParking(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: RegisterShortParkingComponent,
      mode: 'ios',
      cssClass: 'rgs-register',
      id: 'register-short-parking'
    })

    await modal.present();

    return modal;
  }


  public getEstablishments() {
    this.establishments$ = this.establishmentsService.getCollection(CollectionsEnum.SHORT_ESTABLISHMENTS);

    this.establishmentsSubscription = this.establishments$
    .pipe(
      map((establishments: IShortEstablishment[]) => {
        this.utilsService.orderByAdressNumberCrescent(establishments);
        return establishments
      })
    )
    .subscribe((establishments: IShortEstablishment[]) => {
      this.short_establishments = establishments;

      this.lenghts_to_save_time = [...this.lenghts_to_save_time].map((option: any) => {
        let list = this.short_establishments.filter((establishment: IShortEstablishment) => {
          return establishment.mainType.value === option['establishment_type'];
        })

        option['list'] = list;
        option['length'] = list.length;

        return option;
      })
    })
  }

  public imageHasLoaded() {
    this.isLoadingLogo = false;
  }

  public seeEstablishment(establishment: IShortEstablishment): void {
    this.store.dispatch(RuaGastronomicaDeSantosStore.setCurrentEstablishment({ establishment: establishment } ))
    this.openModalToSeeStablishment();
  }

  public async openModalToSeeStablishment(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: RegisterShortEstablishmentModalComponent,
      mode: 'ios',
      cssClass: 'rgs-register',
      id: 'register-short-establishment'
    })

    await modal.present();

    return modal;
  }

  ngOnDestroy(): void {
    this.establishmentsSubscription.unsubscribe();
  }

}
