import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-painel-rua-gastronomica',
  templateUrl: './painel-rua-gastronomica.page.html',
  styleUrls: ['./painel-rua-gastronomica.page.scss'],
})
export class PainelRuaGastronomicaPage implements OnInit {

  public just_adegas: IShortEstablishment[];
  public just_docerias: IShortEstablishment[];
  public just_emporios: IShortEstablishment[];
  public just_hamburguerias: IShortEstablishment[];
  public just_bares: IShortEstablishment[];
  public just_restaurantes: IShortEstablishment[];
  public just_pizzarias: IShortEstablishment[];
  public just_cafeterias: IShortEstablishment[];

  public isLoadingLogo: boolean;

  public short_establishments: IShortEstablishment[];
  public establishments$: Observable<IShortEstablishment[]>;
  public establishmentsDescription: Subscription;

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
    private utilsService : UtilsService
  ) { }

  ngOnInit() {
    this.getEstablishments();
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

    this.establishmentsDescription = this.establishments$
    .pipe(
      map((establishments: IShortEstablishment[]) => {
        this.utilsService.orderByAdressNumberCrescent(establishments);
        return establishments
      })
    )
    .subscribe((establishments: IShortEstablishment[]) => {
      this.short_establishments = establishments;

      this.just_adegas = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.ADEGA );
      this.just_docerias = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.DOCERIA );
      this.just_emporios = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.EMPORIO );
      this.just_hamburguerias = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.HAMBURGUERIA );
      this.just_bares = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.BAR );
      this.just_restaurantes = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.RESTAURANTE );
      this.just_pizzarias = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.PIZZARIA );
      this.just_cafeterias = this.short_establishments.filter((establishment: IShortEstablishment) => establishment.mainType.value === EstablishmentTypeEnum.CAFETERIA );
    })
  }

  public imageHasLoaded() {
    this.isLoadingLogo = false;
  }

}
