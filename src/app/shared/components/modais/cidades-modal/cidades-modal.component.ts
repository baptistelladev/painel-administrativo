import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StorageService } from 'src/app/core/services/storage.service';
import { CURRENT_CITY } from 'src/app/shared/consts/keys';
import { MOCK_CITIES } from 'src/app/shared/mocks/MockCities';
import { ICity } from 'src/app/shared/models/ICity';
import * as AppStore from 'src/app/shared/store/app.state';

@Component({
  selector: 'app-cidades-modal',
  templateUrl: './cidades-modal.component.html',
  styleUrls: ['./cidades-modal.component.scss'],
})
export class CidadesModalComponent  implements OnInit {

  @Input() currentCity: ICity;

  public MOCK_CITIES: ICity[] = [...MOCK_CITIES];

  constructor(
    private store : Store,
    private modalCtrl : ModalController,
    private storageService : StorageService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
  }

  /**
   * @description Seleciona a cidade, guarda no NGRX para refletir no app inteiro e guarda na Storage pois quando a tela
   * é atualizada ou entra no app é a primeiro coisa que checamos.
   */
  public async selectCity(city: any) {
    this.currentCity = city;
    this.store.dispatch(AppStore.setCurrentCity({ city: this.currentCity }))
    await this.storageService.setStorageKey(CURRENT_CITY, this.currentCity.value);
    await this.closeModalAndFireChange();
  }

  /**
   * @description Fechar modal.
   */
  public async closeModal() {
    await this.modalCtrl.dismiss('', '', 'cities-modal');
  }

  /**
   * @description Fecha o modal e dispara.
   */
  public async closeModalAndFireChange() {
    await this.modalCtrl.dismiss(this.currentCity, 'change', 'cities-modal');
  }

}
