import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription, take } from 'rxjs';
import { IPlace } from 'src/app/shared/models/IPlace';
import Swiper from 'swiper';
import * as AppStore from '../../../../../shared/store/app.state';
import { BenefitOperatorsEnum } from 'src/app/shared/enums/BenefitOperators';
import { BenefitConsumerEnum } from 'src/app/shared/enums/BenefitConsumer';
import { ISuggestion } from 'src/app/shared/models/ISuggestion';
import { IFirebaseFilter } from 'src/app/shared/models/IFirebaseFilter';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IFestivalFood } from 'src/app/shared/models/IFestivalFood';
import { FestivalFoodTypeEnum } from 'src/app/shared/enums/FestivalFoodType';
import { PlacesService } from 'src/app/core/services/firebase/places.service';
import { ICity } from 'src/app/shared/models/ICity';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SuggestionsService } from 'src/app/core/services/firebase/suggestions.service';
import { SuggestionsEnum } from 'src/app/shared/enums/Suggestions';
import { EstablishmentModalComponent } from 'src/app/components/modais/establishment-modal/establishment-modal.component';

@Component({
  selector: 'app-festival-de-comida-japonesa',
  templateUrl: './festival-de-comida-japonesa.page.html',
  styleUrls: ['./festival-de-comida-japonesa.page.scss'],
})
export class FestivalDeComidaJaponesaPage implements OnInit, AfterViewInit {

  public lastPathFromUrl: string // O PARAM SERÁ SUBSTITUIDO POR ISSO, POIS ESSA TELA TEM ROTA DEDICADA.

  public BenefitConsumerEnum = BenefitConsumerEnum;
  public BenefitOperatorsEnum = BenefitOperatorsEnum;

  @ViewChild('japaneseSwiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  public hideRightControl: boolean = false;
  public hideLeftControl: boolean = false;

  public places: any[] | null;
  public places$: Observable<IPlace[]>;
  public placesSubscription: Subscription;

  public currentSuggestion: ISuggestion;
  public currentSuggestion$: Observable<ISuggestion>;
  public currentSuggestionSubscription: Subscription;

  public currentCity: ICity;
  public currentCity$: Observable<ICity>;
  public currentCitySubscription: Subscription;

  constructor(
    private navCtrl : NavController,
    private store : Store,
    private placesService : PlacesService,
    private router : Router,
    private title : Title,
    private suggestionsService : SuggestionsService,
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.getCurrentCityFromNGRX();
    this.getCurrentSuggestionFromNGRX();
  }

  ngAfterViewInit(): void {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  public getCurrentCityFromNGRX(): void {
    this.currentCity$ = this.store.select(AppStore.selectAppCurrentCity);

    this.currentCitySubscription = this.currentCity$
    .subscribe((city: ICity) => {
      this.currentCity = city;
    })
  }

  public async getCurrentSuggestionFromNGRX() {
    this.currentSuggestion$ = this.store.select(AppStore.selectCurrentSuggestion);

    this.currentSuggestionSubscription = this.currentSuggestion$
    .subscribe(async (suggestion: ISuggestion) => {
      if (suggestion.id) {
        this.currentSuggestion = suggestion;

        this.getPlacesFromCurrentCity();
      } else {
        this.getSuggestionFromUrl();
      }
    })
  }

  /**
   * @description Tomar cuidado com esta função pois ela é usada em outras telas de sugestões.
   * Neste tela em específico nós não mandamos parâmetro da tela anterior, o Festival de Comida Japonesa possui rota dedicada no projeto.
   * Então "desmembramo" a url e pegamos o último "pedaço".
   */
  public getSuggestionFromUrl() {
    let urlSplited: string[] = this.router.url.split('/');
    this.lastPathFromUrl = urlSplited[urlSplited.length - 1];

    if (this.lastPathFromUrl) {
      this.title.setTitle('Festival de Comida Japonesa');

      this.suggestionsService
      .getSuggestionsCollection(CollectionsEnum.SUGGESTIONS_BAIXADA_SANTISTA, [
        { field: 'value', operator: '==', value: SuggestionsEnum.FESTIVAL_COMIDA_JAPONESA }
      ])
      .pipe((take(1)))
      .subscribe({
        next: async (suggestion: any[]) => {
          if (suggestion) {
            this.currentSuggestion = suggestion[0];
            this.getPlacesFromCurrentCity();
          }
        }
      })
    } else {
      this.navCtrl.navigateBack(['/logado/sugestoes-do-anfitriao'])
    }
  }

  public getPlacesFromCurrentCity(): void {
    this.getPlaces([
      { field: 'suggestions', operator: 'array-contains', value: this.currentSuggestion?.value },
      { field: 'origin.value', operator: '==', value: this.currentCity?.value }
    ]);
  }

  public getPlaces(filters: IFirebaseFilter[] = []) {
    this.places = null;

    this.places$ = this.placesService
      .getPlacesCollection(
        CollectionsEnum.PLACES,
        filters
      );

      this.placesSubscription = this.places$
      .pipe(
        map((places: IPlace[]) => {
          return places.filter((place: IPlace) => {
            // Verifica se a propriedade e o array de festivais existem
            if (place.festival_info?.festivals) {

              return place.festival_info.festivals.some((festival: IFestivalFood) => {
                return festival.food_type?.value === FestivalFoodTypeEnum.COMIDA_JAPONESA;
              });
            }
            return false; // Se não houver festivais, exclui o place
          });
        })
      )
      .subscribe((places: IPlace[]) => {
        this.places = places;
      })
  }

  public slideToNext(): void {
    this.swiper?.slideNext(800);

    if (this.hideLeftControl) {
      this.hideLeftControl = false;
    }
  }

  public slideToPrev(): void {
    this.swiper?.slidePrev(800);

    if (this.hideRightControl) {
      this.hideRightControl = false;
    }
  }

  public seePlace(place: IPlace, e: any): void {
    if (place.isBuilding) {
      e.preventDefault();
    } else {
      this.store.dispatch(AppStore.setCurrentEstablishment({ establishment: place } ))
      this.openModalToSeeStablishment();
    }
  }

  public async openModalToSeeStablishment(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: EstablishmentModalComponent,
      mode: 'ios',
      cssClass: 'rgs-register',
      id: 'register-short-establishment'
    })

    await modal.present();

    return modal;
  }

  public listenForSwiperForControl(ev: any): void {
    this.hideLeftControl = ev.detail[0].isBeginning;
    this.hideRightControl = ev.detail[0].isEnd;
  }

}
