import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablishmentsService } from 'src/app/core/services/firebase/establishments.service';
import { RegisterShortEstablishmentModalComponent } from './modais/register-short-establishment-modal/register-short-establishment-modal.component';
import { RegisterShortParkingComponent } from './modais/register-short-parking/register-short-parking.component';
import * as moment from 'moment';

@Component({
  selector: 'app-painel-rua-gastronomica',
  templateUrl: './painel-rua-gastronomica.page.html',
  styleUrls: ['./painel-rua-gastronomica.page.scss'],
})
export class PainelRuaGastronomicaPage implements OnInit {

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
    },
    {
      text: 'Instagram',
      subtext: 'Perfil oficial',
      href: 'https://www.instagram.com/rgastronomicadesantos/'
    }
  ]

  constructor(
    private establishmentsService : EstablishmentsService,
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {

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

}
