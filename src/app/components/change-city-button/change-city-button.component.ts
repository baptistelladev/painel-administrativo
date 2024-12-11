import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CidadesPage } from 'src/app/pages/tabs/cidades/cidades.page';
import { ICity } from 'src/app/shared/models/ICity';

@Component({
  selector: 'app-change-city-button',
  templateUrl: './change-city-button.component.html',
  styleUrls: ['./change-city-button.component.scss'],
})
export class ChangeCityButtonComponent  implements OnInit {

  @Input() currentCity: ICity;

  constructor(
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {}

  public async openCityModal() {
    const modal = await this.modalCtrl.create({
      component: CidadesPage,
      componentProps: {
        currentCity: this.currentCity
      },
      breakpoints: [1],
      initialBreakpoint: 1,
      mode: 'md',
      cssClass: 'anf-about-us-modal',
      id: 'cities-modal'
    })

    await modal.present();

    await modal.onDidDismiss().then((resp: any) => {
      if (resp.role === 'change') {
        this.segmentChanged();
      }
    })

    return modal;
  }



  public segmentChanged(): void {
    // this.FEATURES = null;
    // this.places = null;
    // MOSTRAR PESSOAS [SOON]  this.people = null;

    // if (this.selectedSegment === LocationEnum.PRAIA) {
    //  this.FEATURES = this.MOCK_BEACH_FEATURES;
    //  this.getPlacesFromBeach();
      // MOSTRAR PESSOAS [SOON] this.getPeopleFromBeach();
    //} else {
    //  this.FEATURES = this.MOCK_CITY_FEATURES;
    //  this.getPlacesFromCity();
      // MOSTRAR PESSOAS [SOON]  this.getPeopleFromCity();
    //}
  }

}
