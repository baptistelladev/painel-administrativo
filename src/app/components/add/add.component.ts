import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablishmentModalComponent } from '../modais/establishment-modal/establishment-modal.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent  implements OnInit {

  constructor(
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {}

  public async openModalToCreateStablishment(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: EstablishmentModalComponent,
      mode: 'ios',
      cssClass: 'rgs-register',
      id: 'register-short-establishment'
    })

    await modal.present();

    return modal
  }

}
