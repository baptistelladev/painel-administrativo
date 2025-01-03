import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablishmentModalComponent } from '../modais/establishment-modal/establishment-modal.component';
import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { SuggestionModalComponent } from '../modais/suggestion-modal/suggestion-modal.component';
import { UsersModalComponent } from '../modais/users-modal/users-modal.component';
import { AdminsModalComponent } from '../modais/admins-modal/admins-modal.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent  implements OnInit {

  @Input() feature : string;

  public FeaturesEnum = FeaturesEnum;

  constructor(
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {}

  public async openModalToCreateStablishment(): Promise<HTMLIonModalElement> {

    let component: any;

    switch (this.feature) {
      case FeaturesEnum.LUGARES:
        component = EstablishmentModalComponent;
        break;

      case FeaturesEnum.SUGESTOES:
        component = SuggestionModalComponent;
        break;

      case FeaturesEnum.USUARIOS:
        component = UsersModalComponent;
        break;

      case FeaturesEnum.ADMINS:
        component = AdminsModalComponent;
        break;
    }

    const modal = await this.modalCtrl.create({
      component,
      mode: 'md',
      cssClass: 'rgs-register',
      id: this.feature === FeaturesEnum.LUGARES ?
      'register-short-establishment' : this.feature === FeaturesEnum.SUGESTOES ?
      'register-suggestion' : this.feature === FeaturesEnum.USUARIOS ?
      'register-users' : this.feature === FeaturesEnum.USUARIO ?
      'update-user' : this.feature === FeaturesEnum.ADMINS ?
      'register-admin' : ''
    });

    await modal.present();

    return modal;
  }

}
