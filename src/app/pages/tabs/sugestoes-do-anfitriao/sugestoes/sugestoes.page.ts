import { ProfileTypeEnum } from './../../../../shared/enums/ProfileType';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { ICity } from 'src/app/shared/models/ICity';
import { ISuggestion } from 'src/app/shared/models/ISuggestion';
import Swiper from 'swiper';
import * as AppStore from './../../../../shared/store/app.state';
import { OverlayService } from 'src/app/shared/services/overlay.service';
import { SuggestionsService } from 'src/app/core/services/firebase/suggestions.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { SuggestionsEnum } from 'src/app/shared/enums/Suggestions';
import { SuggestionModalComponent } from 'src/app/shared/components/modais/suggestion-modal/suggestion-modal.component';

@Component({
  selector: 'app-sugestoes',
  templateUrl: './sugestoes.page.html',
  styleUrls: ['./sugestoes.page.scss'],
})
export class SugestoesPage implements OnInit {

  @ViewChild('sugestoesContent') sugestoesContent: IonContent;

  @ViewChild('baixadaSantistaSwiper')
  baixadaSantistaSwiperRef: ElementRef | undefined;
  baixadaSantistaSwiper?: Swiper;

  public suggestionsBaixadaSantista: ISuggestion[];
  public suggestionsBaixadaSantista$: Observable<ISuggestion[]>
  public suggestionsBaixadaSantistaSubscription: Subscription;

  public suggestionsSelectedCity: ISuggestion[];
  public suggestionsSelectedCity$: Observable<ISuggestion[]>
  public suggestionsSelectedCitySubscription: Subscription;

  public currentCity: ICity;
  public currentCity$: Observable<ICity>;
  public currentCitySubscription: Subscription;

  public FeaturesEnum = FeaturesEnum;
  public ProfileType = ProfileTypeEnum;

  public hideRightControl: boolean = false;
  public hideLeftControl: boolean = true;

  constructor(
    private store : Store,
    private navCtrl : NavController,
    private overlayService : OverlayService,
    private suggestionsService : SuggestionsService,
    private alertCtrl : AlertController,
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.getBaixadaSantistaSuggestions();
    this.getCurrentCityFromNGRX();
  }

  /**
   * @description Ir para o próximo slide.
   */
  public slideToNext(): void {
    this.baixadaSantistaSwiper?.slideNext(800);
  }

  /**
   * @description Ir para slide anterior.
   */
  public slideToPrev(): void {
    this.baixadaSantistaSwiper?.slidePrev(800);
  }

  /**
   * @description Guarda a sugestão no NGRX e vai para página correspondente.
   */
  public seeSuggestion(suggestion: ISuggestion) {
    this.store.dispatch(AppStore.setCurrentSuggestion({ suggestion: suggestion }))
    this.navCtrl.navigateForward([`/logado/sugestoes-do-anfitriao/${suggestion.route}`]);
  }

  /**
   * @description Detecta mudanças no swiper para esconder o botão de próximo e anterior conforme o slide estiver no começo ou fim.
   */
  public listenForSwiperForControl(ev: any): void {
    this.hideLeftControl = ev.detail[0].isBeginning;
    this.hideRightControl = ev.detail[0].isEnd;
  }

  /**
   * @description Obtém lista de sugestões cujo tem a opção BAIXADA SANTISTA no filtro.
   */
  public async getBaixadaSantistaSuggestions() {
    this.suggestionsBaixadaSantista$ = this.suggestionsService
    .getSuggestionsCollection(CollectionsEnum.SUGGESTIONS_BAIXADA_SANTISTA, [
      { field: "filter", operator: "array-contains", value: SuggestionsEnum.BAIXADA_SANTISTA },
    ])

    this.suggestionsBaixadaSantistaSubscription = this.suggestionsBaixadaSantista$
    .subscribe({
      next: async (suggestions: ISuggestion[]) => {
        this.suggestionsBaixadaSantista = suggestions;
        this.baixadaSantistaSwiper = this.baixadaSantistaSwiperRef?.nativeElement.swiper;
      },
      error: () => {

      }
    })
  }

  /**
   * @description Obtém a cidade selecionada previamente e guardada no NGRX.
   */
  public getCurrentCityFromNGRX(): void {
    this.currentCity$ = this.store.select(AppStore.selectAppCurrentCity);

    this.currentCitySubscription = this.currentCity$
    .subscribe((city: ICity) => {
      this.currentCity = city;
      this.getSelectedCitySuggestions(this.currentCity.value);
    })
  }

  /**
   * @description Obtém sugestões específicas da cidade selecionada.
   */
  public async getSelectedCitySuggestions(cityValue: string) {
    this.suggestionsSelectedCity$ = this.suggestionsService
    .getSuggestionsCollection(CollectionsEnum.SUGGESTIONS_BAIXADA_SANTISTA, [
      { field: "filter", operator: "array-contains", value: cityValue },
    ])

    this.suggestionsSelectedCitySubscription = this.suggestionsSelectedCity$
    .subscribe({
      next: (suggestions: any) => {
        this.suggestionsSelectedCity = suggestions;
      },
      error: () => {

      },
      complete: async () => {

      }
    })
  }

  /**
   * @description Mostra um alerta para confirmar a remoção da sugestão selecionada.
   */
  public async showAlertToRemove(suggestion: ISuggestion): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      message: `Confirmar remoção de ${suggestion.name.text.pt}?`,
      subHeader: `${suggestion.name.text.pt}`,
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
            await this.suggestionsService.removeSuggestionDoc(CollectionsEnum.SUGGESTIONS_BAIXADA_SANTISTA, suggestion.id);
          }
        },
      ]
    })

    await alert.present();

    return alert;
  }

  /**
   * @description Abre o modal com formulário para criação ou atualização de uma sugestão.
   */
  public async openModalToCreateOrUpdateSuggestion(suggestion: ISuggestion): Promise<HTMLIonModalElement> {
    this.store.dispatch(AppStore.setCurrentSuggestion({ suggestion: suggestion }))

    const modal = await this.modalCtrl.create({
      component: SuggestionModalComponent,
      mode: 'md',
      cssClass: 'rgs-register',
      id: 'register-suggestion'
    });

    await modal.present();

    return modal;
  }

}
