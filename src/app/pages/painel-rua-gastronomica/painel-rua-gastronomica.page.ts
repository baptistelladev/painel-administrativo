import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablishmentsService } from 'src/app/core/services/firebase/establishments.service';
import { RegisterShortEstablishmentModalComponent } from './modais/register-short-establishment-modal/register-short-establishment-modal.component';

@Component({
  selector: 'app-painel-rua-gastronomica',
  templateUrl: './painel-rua-gastronomica.page.html',
  styleUrls: ['./painel-rua-gastronomica.page.scss'],
})
export class PainelRuaGastronomicaPage implements OnInit {

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

}
