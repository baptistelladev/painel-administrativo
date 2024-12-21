import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablishmentModalComponent } from '../modais/establishment-modal/establishment-modal.component';
import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { SuggestionModalComponent } from '../modais/suggestion-modal/suggestion-modal.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent  implements OnInit {

  @Input() feature : string;

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
    }

    // Cria o modal com as configurações apropriadas
    const modal = await this.modalCtrl.create({
      component,
      mode: 'ios',
      cssClass: 'rgs-register',
      id: this.feature === FeaturesEnum.LUGARES ?
      'register-short-establishment' : this.feature === FeaturesEnum.SUGESTOES ?
      'register-suggestion' : ''
    });

    // Apresenta o modal na tela
    await modal.present();

    return modal;
  }

}
