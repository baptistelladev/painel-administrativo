import { IFestivalFood } from './../../../shared/models/IFestivalFood';
import { BenefitTypeEnum } from './../../../shared/enums/BenefitType';
import { MOCK_FESTIVAL_FOOD_TYPE } from './../../../shared/mocks/MockFestivalFoodType';

import { MOCK_SANTOS_BEACHES, MOCK_SAO_VICENTE_BEACHES } from '../../../shared/mocks/MockBeaches';


import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, ModalController } from '@ionic/angular';
import { map, Observable,  Subscription } from 'rxjs';
import { CepService } from 'src/app/core/services/cep.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { PlaceTypeCityEnum } from 'src/app/shared/enums/PlaceType';
import { MOCK_DAYS } from 'src/app/shared/mocks/MockDays';
import { MOCK_CITY_PLACES_TYPE } from 'src/app/shared/mocks/MockCityPlacesType';
import { MOCK_MARKET_TICKETS } from 'src/app/shared/mocks/MockMarketTickets';
import { MOCK_NETWORKS } from 'src/app/shared/mocks/MockNetworks';
import { MOCK_PHONES } from 'src/app/shared/mocks/MockPhones';
import { MOCK_TICKETS } from 'src/app/shared/mocks/MockTickets';
import { IAdress } from 'src/app/shared/models/IAddress';
import { IPlace } from 'src/app/shared/models/IPlace';
import { IPlaceSpecialty } from 'src/app/shared/models/IPlaceSpecialty';
import { IPlaceType } from 'src/app/shared/models/IPlaceType';
import { ISocialNetwork } from 'src/app/shared/models/INetwork';
import { IPhone } from 'src/app/shared/models/IPhone';
import { ITicket } from 'src/app/shared/models/ITicket';
import { ITime } from 'src/app/shared/models/ITime';
import * as AppStore from './../../../shared/store/app.state';
import { Store } from '@ngrx/store';
import { IHour } from 'src/app/shared/models/IHour';
import { PlacesService } from 'src/app/core/services/firebase/places.service';
import { MOCK_SPECIALTIES } from 'src/app/shared/mocks/MockSpecialties';
import { ICity } from 'src/app/shared/models/ICity';
import { MOCK_CITIES } from 'src/app/shared/mocks/MockCities';
import { CityEnum } from 'src/app/shared/enums/City';
import { SuggestionsService } from 'src/app/core/services/firebase/suggestions.service';
import { ISuggestion } from 'src/app/shared/models/ISuggestion';
import * as moment from 'moment';
import { ILocation } from 'src/app/shared/models/ILocation';
import { MOCK_LOCATION } from 'src/app/shared/mocks/MockLocation';
import { IBeach } from 'src/app/shared/models/IBeach';
import { LocationEnum } from 'src/app/shared/enums/Location';
import { CurrencyPipe } from '@angular/common';
import { IFestivalFoodType } from 'src/app/shared/models/IFestivalFoodType';
import { MOCK_FESTIVAL_CONSUMER_TYPE } from 'src/app/shared/mocks/MockConsumerFestivalType';
import { MOCK_FESTIVAL_OPERATOR } from 'src/app/shared/mocks/MockFestivalOperator';
import { MOCK_FESTIVAL_BENEFIT_TYPE } from 'src/app/shared/mocks/MockFestivalBenefitType';
import { BenefitConsumerEnum } from 'src/app/shared/enums/BenefitConsumer';
import { IFestivalConsumerType } from 'src/app/shared/models/IFestivalConsumerType';
import { IFestivalBenefitType } from 'src/app/shared/models/IFestivalBenefiType';
import { IFestivalOperator } from 'src/app/shared/models/IFestivalOperator';
import { MOCK_BEACH_PLACES_TYPE } from 'src/app/shared/mocks/MockBeachPlacesType';
@Component({
  selector: 'app-establishment-modal',
  templateUrl: './establishment-modal.component.html',
  styleUrls: ['./establishment-modal.component.scss'],
})
export class EstablishmentModalComponent  implements OnInit, AfterViewInit, OnDestroy {

  public LocationEnum = LocationEnum;

  public showSundays: boolean = false;
  public showTuesdays: boolean = false;
  public showWednesdays: boolean = false;
  public showThursdays: boolean = false;
  public showFridays: boolean = false;
  public showSaturdays: boolean = false;
  public showMondays: boolean = false;

  public isRegistering: boolean = false;

  public selectedTime: any;

  // USADO PARA MANIPULARO DATETIME.
  @ViewChild('datetime') datetime: IonDatetime;
  public timerDatetime: boolean = false;

  public formShortEstablishment: FormGroup;

  public establishment: IPlace = {
    last_update: '',
    work_place: [],
    created_at: '',
    isBuilding: false,
    isPremium: false,
    id: '',
    name: '',
    sub_name: '',
    value: '',
    adress: {
      number: '',
      neighborhood: '',
      street: '',
      zip_code: '',
      type: {
        pt: '',
        en: '',
        es: ''
      }
    },
    origin: {
      value: '',
      name: '',
      sigla: '',
      isDisabled: false,
      from: {
        pt: '',
        en: '',
        es: ''
      },
      in: {
        pt: '',
        en: '',
        es: ''
      },
      hasBeach: false
    },
    specialty: [
      {
        value: '',
        text: {
          pt: '',
          en: '',
          es: ''
        }
      }
    ],
    mainType: {
      value: '',
      text: {
        pt: '',
        en: '',
        es: ''
      }
    },
    ticket_info: {
      accept_ticket: false,
      show_field: false,
      tickets: [
        {
          value: '',
          text: ''
        }
      ]
    },
    children_space: {
      has_space: false,
      show_field: false,
      is_paid: false
    },
    market_ticket_info: {
      accept_ticket: false,
      show_field: false,
      tickets: [
        {
          value: '',
          text: ''
        }
      ]
    },
    petfriendly_info: {
      accept_petfriendly: false,
      show_field: false
    },
    livemusic_info: {
      has_livemusic: false,
      show_field: false
    },
    air_conditioned_info: {
      has_air_conditioned: false,
      show_field: false
    },
    booking_info: {
      accept_booking: false,
      show_field: false
    },
    working_time: [
      {
        day_number: 0,
        text: {
          pt: '',
          en: '',
          es: ''
        },
        opening_time: [
          {
            open: '',
            close: ''
          }
        ]
      }
    ],
    phones: [
      {
        number: '',
        type: '',
        ddd: '',
        text: ''
      }
    ],
    networks: [
      {
        text: '',
        value: '',
        baseUrl: '',
        user: '',
        appBaseUrl: ''
      }
    ],
    suggestions: [],
    beachInfo: {
      value: '',
      city: '',
      text: {
        pt: '',
        en: '',
        es: ''
      },
      popularName: '',
      located: {
        from: {
          value: '',
          text: ''
        },
        operator: {
          text: {
            pt: '',
            en: '',
            es: ''
          },
          value: ''
        },
        to: {
          value: '',
          text: ''
        }
      },
      in: {
        pt: '',
        en: '',
        es: ''
      },
      location: {
        lat: 0,
        lng: 0
      },
      kmlCoordinates: []
    },
    delivery_sand: {
      make_delivery: false,
      delivery_is_free: false
    },
    festival_info: {
      has_any_festival_type: false,
      show_field: false,
      festivals: []
    },
  }

  public MOCK_PLACES_TYPE: IPlaceType[];
  public MOCK_CITY_PLACES_TYPE: IPlaceType[] = MOCK_CITY_PLACES_TYPE;
  public MOCK_BEACH_PLACES_TYPE: IPlaceType[] = MOCK_BEACH_PLACES_TYPE;
  public MOCK_TICKETS: ITicket[] = MOCK_TICKETS;
  public MOCK_MARKET_TICKETS: ITicket[] = MOCK_MARKET_TICKETS;
  public MOCK_NETWORKS: ISocialNetwork[] = MOCK_NETWORKS;
  public MOCK_PHONES: IPhone[] = MOCK_PHONES;
  public MOCK_DAYS: ITime[] = MOCK_DAYS;
  public MOCK_SPECIALTIES: IPlaceSpecialty[] = MOCK_SPECIALTIES;
  public MOCK_CITIES: ICity[] = [...MOCK_CITIES];
  public MOCK_LOCATION: ILocation[] = MOCK_LOCATION;
  public MOCK_BEACHES: IBeach[];
  public MOCK_FESTIVAL_FOOD_TYPE: IFestivalFoodType[] = MOCK_FESTIVAL_FOOD_TYPE;
  public MOCK_FESTIVAL_CONSUMER_TYPE = MOCK_FESTIVAL_CONSUMER_TYPE;
  public MOCK_FESTIVAL_OPERATOR = MOCK_FESTIVAL_OPERATOR;
  public MOCK_FESTIVAL_BENEFIT_TYPE = MOCK_FESTIVAL_BENEFIT_TYPE;

  public PlaceTypeCityEnum = PlaceTypeCityEnum;

  public currentEstablishment: IPlace;
  public establishment$: Observable<IPlace>;
  public establishmentSubscription: Subscription;

  public suggestions: ISuggestion[];
  public suggestions$: Observable<ISuggestion[]>;
  public suggestionsSubscription: Subscription;

  constructor(
    private formBuilder : FormBuilder,
    private modalCtrl : ModalController,
    private placesService : PlacesService,
    private cepService : CepService,
    private store : Store,
    private suggestionsService : SuggestionsService
  ) { }

  ngOnInit() {
    this.initFormShortEstablishment();
    this.getCurrentEstablishmentFromNGRX();
    this.getSuggestions();
  }

  ngAfterViewInit(): void {

  }

  public getSuggestions() {
    this.suggestions$ = this.suggestionsService.getSuggestions(CollectionsEnum.SUGGESTIONS_BAIXADA_SANTISTA);

    this.suggestionsSubscription = this.suggestions$
    .subscribe((suggestions: ISuggestion[]) => {
      this.suggestions = suggestions;
    })
  }

  public initFormShortEstablishment(): void {
    this.formShortEstablishment = this.formBuilder.group({
      sub_name: [''],
      name: ['', [ Validators.required, Validators.minLength(2) ]],
      specialty: [''],
      mainType: ['', [ Validators.required ]],
      zip_code: ['', [ Validators.required, Validators.minLength(8) ]],
      type: ['', [ Validators.required ]],
      street: ['', Validators.required ],
      neighborhood: ['', Validators.required ],
      number : ['', Validators.required ],
      city : ['', Validators.required ],
      hasAirConditioned: [false, Validators.required ],
      showAirConditionedField: [true, Validators.required ],
      hasLiveMusic: [false, Validators.required ],
      showLiveMusic: [true, Validators.required ],
      hasBooking: [false, Validators.required ],
      showBooking: [true, Validators.required ],
      isPetFriendly: [false, Validators.required ],
      showPetFriendly: [true, Validators.required ],
      hasChildrenSpace: [false, Validators.required ],
      showChildrenSpace: [true, Validators.required ],
      childrenSpaceIsPaid: [false, Validators.required ],
      acceptVale: [false, Validators.required ],
      showVale: [true, Validators.required ],
      ticketName: '',
      acceptMarketVale: false,
      marketTicketName: '',
      showMarketVale: false,
      phones: this.formBuilder.array([], [Validators.required]),
      networks: this.formBuilder.array([], [Validators.required]),
      mondaysHour: this.formBuilder.array([]),
      tuesdaysHour: this.formBuilder.array([]),
      wednesdaysHour: this.formBuilder.array([]),
      thursdaysHour: this.formBuilder.array([]),
      fridaysHour: this.formBuilder.array([]),
      saturdaysHour: this.formBuilder.array([]),
      sundaysHour: this.formBuilder.array([]),
      url: ['', [Validators.required]],
      isBuilding: [false, [Validators.required]],
      sundaysHourToggle: false,
      isPremium: [false, [ Validators.required ]],
      suggestions: [],
      workAt: ['', [ Validators.required ]],
      beach: [''], // OBRIGATÓRIO QUANDO FOR NA PRAIA.
      mainBeach: [''], // OBRIGATÓRIO QUANDO FOR NA PRAIA.,
      makeDeliveryOnTheBeach: [false],
      deliveryIsFreeOnTheBeach: [false],
      offerFestival: [false, [ Validators.required ]],
      showOfferFestival: [true, [ Validators.required ]],
      festivals: this.formBuilder.array([])
    })
  }

  public beachChanged(e: any): void {
    console.log(e.detail.value);
  }

  public async registerEstablishment(type: 'create' | 'update') {
    this.isRegistering = true;

    if (this.currentEstablishment.id) {
      this.establishment.id = this.currentEstablishment.id;
    }

    this.establishment.name = this.formShortEstablishment.get('name')?.value;

    this.establishment.sub_name = this.formShortEstablishment.get('sub_name')?.value;

    let foundType: IPlaceType | undefined = this.MOCK_PLACES_TYPE.find((type: IPlaceType) => {
      return type.value === this.formShortEstablishment.get('mainType')?.value
    })

    if (foundType) {
      this.establishment.mainType = foundType;
    }

    this.establishment.adress.zip_code = this.formShortEstablishment.get('zip_code')?.value;
    this.establishment.adress.street = this.formShortEstablishment.get('street')?.value;
    this.establishment.adress.neighborhood = this.formShortEstablishment.get('neighborhood')?.value;
    this.establishment.adress.number = this.formShortEstablishment.get('number')?.value;

    this.establishment.air_conditioned_info.has_air_conditioned = this.formShortEstablishment.get('hasAirConditioned')?.value;
    this.establishment.air_conditioned_info.show_field = this.formShortEstablishment.get('showAirConditionedField')?.value;

    this.establishment.booking_info.accept_booking = this.formShortEstablishment.get('hasBooking')?.value;
    this.establishment.booking_info.show_field = this.formShortEstablishment.get('showBooking')?.value;

    this.establishment.livemusic_info.has_livemusic = this.formShortEstablishment.get('hasLiveMusic')?.value;
    this.establishment.livemusic_info.show_field = this.formShortEstablishment.get('showLiveMusic')?.value;

    this.establishment.petfriendly_info.accept_petfriendly = this.formShortEstablishment.get('isPetFriendly')?.value;
    this.establishment.petfriendly_info.show_field = this.formShortEstablishment.get('showPetFriendly')?.value;

    this.establishment.ticket_info.accept_ticket = this.formShortEstablishment.get('acceptVale')?.value;
    this.establishment.ticket_info.show_field = this.formShortEstablishment.get('showVale')?.value;

    this.establishment.children_space.has_space = this.formShortEstablishment.get('hasChildrenSpace')?.value;
    this.establishment.children_space.show_field = this.formShortEstablishment.get('showChildrenSpace')?.value;
    this.establishment.children_space.is_paid = this.formShortEstablishment.get('childrenSpaceIsPaid')?.value;

    if (this.formShortEstablishment.get('ticketName')?.value && this.formShortEstablishment.get('ticketName')?.value.length > 0) {
      let ticketValues = this.formShortEstablishment.get('ticketName')?.value

      console.log(ticketValues);


      let ticketsFiltered: ITicket[] = this.MOCK_TICKETS.filter((ticket: ITicket) => ticketValues.some((value: string) => ticket.value === value) )

      this.establishment.ticket_info.tickets = ticketsFiltered;

    } else {
      this.establishment.ticket_info.tickets = [];
    }

    // ALIMENTAÇÃO
    this.establishment.market_ticket_info.accept_ticket = this.formShortEstablishment.get('acceptMarketVale')?.value;
    this.establishment.market_ticket_info.show_field = this.formShortEstablishment.get('showMarketVale')?.value;

    if (this.formShortEstablishment.get('marketTicketName')?.value && this.formShortEstablishment.get('marketTicketName')?.value.length > 0) {
      let ticketValues = this.formShortEstablishment.get('marketTicketName')?.value

      let ticketsFiltered: ITicket[] = this.MOCK_TICKETS.filter((ticket: ITicket) => ticketValues.some((value: string) => ticket.value === value) )

      this.establishment.market_ticket_info.tickets = ticketsFiltered;

    } else {
      this.establishment.market_ticket_info.tickets = [];
    }

    if (this.formShortEstablishment.get('networks')?.value && this.formShortEstablishment.get('networks')?.value.length > 0) {
      let networksValues = this.formShortEstablishment.get('networks')?.value;

      let filteredNetworks: ISocialNetwork[] = [...this.MOCK_NETWORKS].filter((network: ISocialNetwork) => {
        return networksValues.some((obj: any) => {
          if (network.value === obj['value']) {
            network.user = obj['user']
          }

          return network.value === obj['value']
        })
      });

      this.establishment.networks = filteredNetworks;
    } else {
      this.establishment.networks = [];
    }

    if (this.formShortEstablishment.get('phones')?.value && this.formShortEstablishment.get('phones')?.value.length > 0) {
      let phonesValues = this.formShortEstablishment.get('phones')?.value

      let filteredPhones: IPhone[] = [...this.MOCK_PHONES].filter((phone: IPhone) => {
        return phonesValues.some((obj: any) => {
          if (phone.type === obj['type']) {
            phone.ddd = obj['ddd'];
            phone.number = obj['number'];
          }

          return phone.type === obj['type']
        })
      });

      this.establishment.phones = filteredPhones;

    } else {
      this.establishment.phones = [];
    }

    let working_time = [...this.MOCK_DAYS].map((day: ITime) => {
      switch (day.day_number) {
        case 0:
          day.opening_time = this.formShortEstablishment.get('sundaysHour')?.value;
          break;

        case 1:
          day.opening_time = this.formShortEstablishment.get('mondaysHour')?.value;
          break;

        case 2:
          day.opening_time = this.formShortEstablishment.get('tuesdaysHour')?.value;
          break;

        case 3:
          day.opening_time = this.formShortEstablishment.get('wednesdaysHour')?.value;
          break;

        case 4:
          day.opening_time = this.formShortEstablishment.get('thursdaysHour')?.value;
          break;

        case 5:
          day.opening_time = this.formShortEstablishment.get('fridaysHour')?.value;
          break;

        case 6:
          day.opening_time = this.formShortEstablishment.get('saturdaysHour')?.value;
          break;
      }

      return day;
    })

    this.establishment.working_time = working_time;

    this.establishment.value = this.formShortEstablishment.get('url')?.value;

    if (this.formShortEstablishment.get('specialty')?.value && this.formShortEstablishment.get('specialty')?.value.length > 0) {
      let specialtiesValues = this.formShortEstablishment.get('specialty')?.value

      let specialtiesFiltered: IPlaceSpecialty[] = this.MOCK_SPECIALTIES.filter((specialty: IPlaceSpecialty) => specialtiesValues.some((value: string) => specialty.value === value) )

      this.establishment.specialty = specialtiesFiltered;

    } else {
      this.establishment.specialty = [];
    }

    this.establishment.isBuilding = this.formShortEstablishment.get('isBuilding')?.value;
    this.establishment.isPremium = this.formShortEstablishment.get('isPremium')?.value;

    switch (this.formShortEstablishment.get('type')?.value) {
      case 'rua':
        this.establishment.adress.type.pt = 'Rua';
        this.establishment.adress.type.en = 'Street';
        this.establishment.adress.type.es = 'Calle';
        break;

      case 'avenida':
        this.establishment.adress.type.pt = 'Avenida';
        this.establishment.adress.type.en = 'Avenue';
        this.establishment.adress.type.es = 'Avenida';
        break;
    }

    let selectedCity = this.MOCK_CITIES.find((city: ICity) => {
      return city.value === this.formShortEstablishment.get('city')?.value;
    })

    if (selectedCity) {
      this.establishment.origin = { ...selectedCity };
      delete this.establishment.origin.isDisabled
    }

    this.establishment.suggestions = this.formShortEstablishment.get('suggestions')?.value;

    this.establishment.work_place = this.formShortEstablishment.get('workAt')?.value;

    // EXCLUSIVO PARA LUGARES LOCALIZADOS NA PRAIA.
    let selectedBeach: IBeach | undefined;

    if (this.formShortEstablishment.get('beach')?.value && this.MOCK_BEACHES) {
      selectedBeach = this.MOCK_BEACHES.find((beach: IBeach) => {
        return beach.value === this.formShortEstablishment.get('beach')?.value;
      })

      if (selectedBeach) {
        this.establishment.beachInfo = selectedBeach;
      }
    }

    this.establishment.delivery_sand = {
      make_delivery: this.formShortEstablishment.get('makeDeliveryOnTheBeach')?.value,
      delivery_is_free: this.formShortEstablishment.get('deliveryIsFreeOnTheBeach')?.value
    }

    this.establishment.festival_info = {
      has_any_festival_type: this.formShortEstablishment.get('offerFestival')?.value,
      show_field: this.formShortEstablishment.get('showOfferFestival')?.value,
      festivals: this.formShortEstablishment.get('festivals')?.value
    }

    this.establishment.last_update = moment().toISOString();

    // ATRIBUIR AO FESTIVAL OS RESPECTIVOS VALORES.
    if (this.establishment.festival_info.festivals && this.establishment.festival_info.festivals.length > 0) {

      let blankSpaceToFillOptionWhenNotFound = {
        value: '',
        text: {
          pt: '',
          en: '',
          es: ''
        }
      }

      this.establishment.festival_info.festivals.forEach( (festival: IFestivalFood) => {
        festival.last_update = moment().toISOString();

        if (festival.food_type) {
          festival.food_type = this.MOCK_FESTIVAL_FOOD_TYPE.find((festivalFoodType: any) => {
            return festivalFoodType.value === festival.food_type
          })
        } else {
          festival.food_type = blankSpaceToFillOptionWhenNotFound;
        }

        if (festival.rules && festival.rules.length > 0) {
          festival.rules?.forEach((rule: any) => {

            if (rule.consumer_festival_type) {
              rule.consumer_festival_type = this.MOCK_FESTIVAL_CONSUMER_TYPE.find((consumerType: IFestivalConsumerType) => {
                return consumerType.value === rule.consumer_festival_type
              })
            } else {
              rule.consumer_festival_type = blankSpaceToFillOptionWhenNotFound;
            }

            if (rule.benefit_type) {
              rule.benefit_type = this.MOCK_FESTIVAL_BENEFIT_TYPE.find((benefitType: IFestivalBenefitType) => {
                return benefitType.value === rule.benefit_type;
              })
            } else {
              rule.benefit_type = blankSpaceToFillOptionWhenNotFound;
            }

            if (rule.operator) {
              rule.operator = this.MOCK_FESTIVAL_OPERATOR.find((operatorType: IFestivalOperator) => {
                return operatorType.value === rule.operator;
              });
            } else {
              rule.operator = blankSpaceToFillOptionWhenNotFound;
            }

            rule.price = Number(rule.price);
            rule.discount = Number(rule.discount);
          })
        }
      })
    }

    if (type === 'create') {
      this.establishment.created_at = moment().toISOString();

      await this.placesService.addDoc(CollectionsEnum.PLACES, this.establishment)
      .then(async () => {
        await this.modalCtrl.dismiss({ establishment: this.establishment }, '', 'register-short-establishment');
        this.isRegistering = false;
        this.formShortEstablishment.reset();
      }).catch(() => {
        this.isRegistering = false;
      })
    } else {
      await this.placesService.setDoc(CollectionsEnum.PLACES, this.currentEstablishment.id, this.establishment)
      .then(async () => {
        await this.modalCtrl.dismiss({ establishment: this.establishment }, '', 'register-short-establishment');
        this.isRegistering = false;
        this.formShortEstablishment.reset();
      }).catch(() => {
        this.isRegistering = false;
      })
    }


  }

  public async mainTypeChanged(e: any) {
    if (e.detail.value === PlaceTypeCityEnum.EMPORIO) {
      this.formShortEstablishment.get(['acceptMarketVale', 'marketTicketName', 'showMarketVale'])?.addValidators([Validators.required]);
    } else {
      this.formShortEstablishment.get(['acceptMarketVale', 'marketTicketName', 'showMarketVale'])?.removeValidators([Validators.required]);
    }
  }

  public cityChanged(e: any) {
    this.defineBeachSelector(e.detail.value);
  }

  public async getCep() {
    let cep = this.formShortEstablishment.get('zip_code')?.value;

    if (cep.length > 8) {
      return;
    }

    if (cep.length === 8) {
     await this.cepService.getCep(cep).then((adress: IAdress) => {

      let longStreetName: string = adress.logradouro;
      let streetSplited: string[] = longStreetName.split(' ');
      let type: string = streetSplited[0].toLowerCase();
      let shortStreetName: string = streetSplited.slice(1).join(' ');

      switch (type) {
        case 'rua':
          this.establishment.adress.type.pt = 'Rua';
          this.establishment.adress.type.en = 'Street';
          this.establishment.adress.type.es = 'Calle';
          break;

        case 'avenida':
          this.establishment.adress.type.pt = 'Avenida';
          this.establishment.adress.type.en = 'Avenue';
          this.establishment.adress.type.es = 'Avenida';
          break;
      }

      switch (adress.localidade) {
        case 'São Vicente':
          this.formShortEstablishment.patchValue({ city: CityEnum.SAO_VICENTE });
          this.defineBeachSelector(CityEnum.SAO_VICENTE);
          break;

        case 'Santos':
          this.formShortEstablishment.patchValue({ city: CityEnum.SANTOS });
          this.defineBeachSelector(CityEnum.SANTOS);
          break;

        case 'Praia Grande':
          this.formShortEstablishment.patchValue({ city: CityEnum.PRAIA_GRANDE });
          this.defineBeachSelector(CityEnum.PRAIA_GRANDE);
          break;

        case 'Guarujá':
          this.formShortEstablishment.patchValue({ city: CityEnum.GUARUJA });
          this.defineBeachSelector(CityEnum.GUARUJA);
          break;

        case 'Peruíbe':
          this.formShortEstablishment.patchValue({ city: CityEnum.PERUIBE });
          this.defineBeachSelector(CityEnum.PERUIBE);
          break;

        case 'Bertioga':
          this.formShortEstablishment.patchValue({ city: CityEnum.BERTIOGA });
          this.defineBeachSelector(CityEnum.BERTIOGA);
          break;

        case 'Cubatão':
          this.formShortEstablishment.patchValue({ city: CityEnum.CUBATAO });
          this.defineBeachSelector(CityEnum.CUBATAO);
          break;

        case 'Itanhaém':
          this.formShortEstablishment.patchValue({ city: CityEnum.ITANHAEM });
          this.defineBeachSelector(CityEnum.ITANHAEM);
          break;

        case 'Mongaguá':
          this.formShortEstablishment.patchValue({ city: CityEnum.MONGAGUA });
          this.defineBeachSelector(CityEnum.MONGAGUA);
          break;
      }


      this.formShortEstablishment.patchValue({ street: shortStreetName });
      this.formShortEstablishment.patchValue({ neighborhood: adress.bairro });
      this.formShortEstablishment.patchValue({ type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() });
     })
    }

  }

  public async suggestionChanged(e: any) {
    console.log(e);
  }

  public async specialtyChanged(e: any) {
    console.log(e);
  }

  public async ticketChanged(e: any) {
    console.log(e);
  }

  public async foodTypeFromFestivalChanged(e: any) {
    console.log(e);
  }

  public async consumerFestivalTypeChanged(e: any) {
    console.log(e);
  }

  public async consumerBenefitTypeChanged(e: any) {
    console.log(e);
  }

  public async workAtChanged(e: any) {
    let values: string[] = e.detail.value

    if (values.length === 1 && values[0] === LocationEnum.CIDADE) {
      this.MOCK_PLACES_TYPE = this.MOCK_CITY_PLACES_TYPE;
    }

    if (values.length === 1 && values[0] === LocationEnum.PRAIA) {
      this.MOCK_PLACES_TYPE = this.MOCK_BEACH_PLACES_TYPE;
    }

    if (values.length > 1) {
      this.MOCK_PLACES_TYPE = [
        ...this.MOCK_CITY_PLACES_TYPE,
        ...this.MOCK_BEACH_PLACES_TYPE
      ]
    }
  }

  public async marketTicketChanged(e: any) {
    console.log(e);
  }

  public async networkChanged(e: any) {
    console.log(e);
  }

  public getRules(festivalIndex: number): FormArray {
    return this.festivals.at(festivalIndex).get('rules') as FormArray;
  }

  public addRules(festivalIndex: number, rules?: any) {
    const ruleGroup = this.formBuilder.group({
      consumer_festival_type: [rules ? rules.consumer_festival_type.value : '', [ Validators.required ]],
      operator: [rules ? rules.operator.value : ''],
      condition_start: [rules ? rules.condition_start : ''],
      condition_end: [rules ? rules.condition_end : ''],
      benefit_type: [rules ? rules.benefit_type.value : '', [ Validators.required ]],
      discount: [rules ? rules.discount : ''],
      price: [rules ? rules.price : '', [ Validators.required ]]
    });
    this.getRules(festivalIndex).push(ruleGroup);
  }

  public removeRule(festivalIndex: number, index: number) {
    this.getRules(festivalIndex).removeAt(index);
  }

  public getCourtesies(festivalIndex: number): FormArray {
    return this.festivals.at(festivalIndex).get('courtesies') as FormArray;
  }

  public addCourtesies(festivalIndex: number, courtesies?: any) {
    const ruleGroup = this.formBuilder.group({
      cortesy: [courtesies ? courtesies.value : '', [ Validators.required ]]
    });
    this.getCourtesies(festivalIndex).push(ruleGroup);
  }

  public removeCourtesy(festivalIndex: number, index: number) {
    this.getCourtesies(festivalIndex).removeAt(index);
  }

  get festivals(): FormArray {
    return this.formShortEstablishment.get('festivals') as FormArray;
  }

  public addFestival(festival?: IFestivalFood) {
    const festivalGroup = this.formBuilder.group({
      food_type: [festival ? festival.food_type?.value : '', [ Validators.required ]],
      rules: this.formBuilder.array([]),
      has_courtesy: [festival ? festival.has_courtesy : false, [ Validators.required ]],
      courtesies: this.formBuilder.array([])
    });
    this.festivals.push(festivalGroup);
  }

  public removeFestival(index: number) {
    this.festivals.removeAt(index);
  }

  get phones(): FormArray {
    return this.formShortEstablishment.get('phones') as FormArray;
  }

  public addPhone(phone?: IPhone) {
    const phoneGroup = this.formBuilder.group({
      type: [phone ? phone.type : '', [ Validators.required ]],
      ddd: [phone ? phone.ddd : '', [ Validators.required ]],
      number: [phone ? phone.number : '', [ Validators.required ]],
    });
    this.phones.push(phoneGroup);
  }

  public removePhone(index: number) {
    this.phones.removeAt(index);
  }

  get networks(): FormArray {
    return this.formShortEstablishment.get('networks') as FormArray;
  }

  public addNetwork(network?: ISocialNetwork) {
    const networkGroup = this.formBuilder.group({
      value: [network ? network.value : '', [ Validators.required ]],
      user: [network ? network.user : '', [ Validators.required ]]
    });
    this.networks.push(networkGroup);
  }

  public removeNetwork(index: number) {
    this.networks.removeAt(index);
  }

  // DIAS DA SEMANA
  get mondaysHour(): FormArray {
    return this.formShortEstablishment.get('mondaysHour') as FormArray;
  }

  public addMondaysHour(hour?: IHour) {
    const hourGroup = this.formBuilder.group({
      open: [hour ? hour.open : '' , [ Validators.required ]],
      close: [hour ? hour.close : '', [ Validators.required ]]
    });
    this.mondaysHour.push(hourGroup);
  }

  public removeMondaysHour(index: number) {
    this.mondaysHour.removeAt(index);
  }

  public mondaysHourChanged(e: any, ): void {
    const resultado: string[] = e.detail.value.split('T')[1].split(':').slice(0, 2);
    const horarioFormatado: string = resultado.join(':');
    this.selectedTime = horarioFormatado;
  }

  public defineTimeFromMondaysHour(indexInsideFormArray: number, formControl: string): void {
    const mondaysHour = this.formShortEstablishment.get('mondaysHour') as FormArray;
    mondaysHour.at(indexInsideFormArray).get(formControl)?.patchValue(this.selectedTime);
    this.modalCtrl.dismiss({}, '', `modal-${formControl}-${indexInsideFormArray}-mondays-hour`);
  }

  get tuesdaysHour(): FormArray {
    return this.formShortEstablishment.get('tuesdaysHour') as FormArray;
  }

  public addTuesdaysHour(hour?: IHour) {
    const hourGroup = this.formBuilder.group({
      open: [hour ? hour.open : '' , [ Validators.required ]],
      close: [hour ? hour.close : '', [ Validators.required ]]
    });
    this.tuesdaysHour.push(hourGroup);
  }

  public removeTuesdaysHour(index: number) {
    this.tuesdaysHour.removeAt(index);
  }

  public tuesdaysHourChanged(e: any, ): void {
    const resultado: string[] = e.detail.value.split('T')[1].split(':').slice(0, 2);
    const horarioFormatado: string = resultado.join(':');
    this.selectedTime = horarioFormatado;
  }

  public defineTimeFromTuesdaysHour(indexInsideFormArray: number, formControl: string): void {
    const tuesdaysHour = this.formShortEstablishment.get('tuesdaysHour') as FormArray;
    tuesdaysHour.at(indexInsideFormArray).get(formControl)?.patchValue(this.selectedTime);
    this.modalCtrl.dismiss({}, '', `modal-${formControl}-${indexInsideFormArray}-tuesdays-hour`);
  }

  get wednesdaysHour(): FormArray {
    return this.formShortEstablishment.get('wednesdaysHour') as FormArray;
  }

  public addWednesdaysHour(hour?: IHour) {
    const hourGroup = this.formBuilder.group({
      open: [hour ? hour.open : '' , [ Validators.required ]],
      close: [hour ? hour.close : '', [ Validators.required ]]
    });
    this.wednesdaysHour.push(hourGroup);
  }

  public removeWednesdaysHour(index: number) {
    this.wednesdaysHour.removeAt(index);
  }

  public wednesdaysHourChanged(e: any, ): void {
    const resultado: string[] = e.detail.value.split('T')[1].split(':').slice(0, 2);
    const horarioFormatado: string = resultado.join(':');
    this.selectedTime = horarioFormatado;
  }

  public defineTimeFromWednesdaysHour(indexInsideFormArray: number, formControl: string): void {
    const wednesdaysHour = this.formShortEstablishment.get('wednesdaysHour') as FormArray;
    wednesdaysHour.at(indexInsideFormArray).get(formControl)?.patchValue(this.selectedTime);
    this.modalCtrl.dismiss({}, '', `modal-${formControl}-${indexInsideFormArray}-wednesdays-hour`);
  }

  get thursdaysHour(): FormArray {
    return this.formShortEstablishment.get('thursdaysHour') as FormArray;
  }

  public addThursdaysHour(hour?: IHour) {
    const hourGroup = this.formBuilder.group({
      open: [hour ? hour.open : '' , [ Validators.required ]],
      close: [hour ? hour.close : '', [ Validators.required ]]
    });
    this.thursdaysHour.push(hourGroup);
  }

  public removeThursdaysHour(index: number) {
    this.thursdaysHour.removeAt(index);
  }

  public thursdaysHourChanged(e: any, ): void {
    const resultado: string[] = e.detail.value.split('T')[1].split(':').slice(0, 2);
    const horarioFormatado: string = resultado.join(':');
    this.selectedTime = horarioFormatado;
  }

  public defineTimeFromThursdaysHour(indexInsideFormArray: number, formControl: string): void {
    const thursdaysHour = this.formShortEstablishment.get('thursdaysHour') as FormArray;
    thursdaysHour.at(indexInsideFormArray).get(formControl)?.patchValue(this.selectedTime);
    this.modalCtrl.dismiss({}, '', `modal-${formControl}-${indexInsideFormArray}-thursdays-hour`);
  }

  get fridaysHour(): FormArray {
    return this.formShortEstablishment.get('fridaysHour') as FormArray;
  }

  public addFridaysHour(hour?: IHour) {
    const hourGroup = this.formBuilder.group({
      open: [hour ? hour.open : '' , [ Validators.required ]],
      close: [hour ? hour.close : '', [ Validators.required ]]
    });
    this.fridaysHour.push(hourGroup);
  }

  public removeFridaysHour(index: number) {
    this.fridaysHour.removeAt(index);
  }

  public fridaysHourChanged(e: any, ): void {
    const resultado: string[] = e.detail.value.split('T')[1].split(':').slice(0, 2);
    const horarioFormatado: string = resultado.join(':');
    this.selectedTime = horarioFormatado;
  }

  public defineTimeFromFridaysHour(indexInsideFormArray: number, formControl: string): void {
    const fridaysHour = this.formShortEstablishment.get('fridaysHour') as FormArray;
    fridaysHour.at(indexInsideFormArray).get(formControl)?.patchValue(this.selectedTime);
    this.modalCtrl.dismiss({}, '', `modal-${formControl}-${indexInsideFormArray}-fridays-hour`);
  }

  get saturdaysHour(): FormArray {
    return this.formShortEstablishment.get('saturdaysHour') as FormArray;
  }

  public addSaturdaysHour(hour?: IHour) {
    const hourGroup = this.formBuilder.group({
      open: [hour ? hour.open : '' , [ Validators.required ]],
      close: [hour ? hour.close : '', [ Validators.required ]]
    });
    this.saturdaysHour.push(hourGroup);
  }

  public removeSaturdaysHour(index: number) {
    this.saturdaysHour.removeAt(index);
  }

  public saturdaysHourChanged(e: any, ): void {
    const resultado: string[] = e.detail.value.split('T')[1].split(':').slice(0, 2);
    const horarioFormatado: string = resultado.join(':');
    this.selectedTime = horarioFormatado;
  }

  public defineTimeFromSaturdaysHour(indexInsideFormArray: number, formControl: string): void {
    const saturdaysHour = this.formShortEstablishment.get('saturdaysHour') as FormArray;
    saturdaysHour.at(indexInsideFormArray).get(formControl)?.patchValue(this.selectedTime);
    this.modalCtrl.dismiss({}, '', `modal-${formControl}-${indexInsideFormArray}-saturdays-hour`);
  }

  get sundaysHour(): FormArray {
    return this.formShortEstablishment.get('sundaysHour') as FormArray;
  }

  public addSundaysHour(hour?: IHour) {
    const hourGroup = this.formBuilder.group({
      open: [hour ? hour.open : '' , [ Validators.required ]],
      close: [hour ? hour.close : '', [ Validators.required ]]
    });
    this.sundaysHour.push(hourGroup);
  }

  public removeSundaysHour(index: number) {
    this.sundaysHour.removeAt(index);
  }

  public sundaysHourChanged(e: any, ): void {
    const resultado: string[] = e.detail.value.split('T')[1].split(':').slice(0, 2);
    const horarioFormatado: string = resultado.join(':');
    this.selectedTime = horarioFormatado;
  }

  public defineTimeFromSundaysHour(indexInsideFormArray: number, formControl: string): void {
    const sundaysHour = this.formShortEstablishment.get('sundaysHour') as FormArray;
    sundaysHour.at(indexInsideFormArray).get(formControl)?.patchValue(this.selectedTime);
    this.modalCtrl.dismiss({}, '', `modal-${formControl}-${indexInsideFormArray}-sundays-hour`);
  }

  public clearWorkingTimeWhenSwithIsFalse(e: any, formControlName: string) {
    const formArray = this.formShortEstablishment.get(formControlName) as FormArray;

    if (!e.detail.checked) {
      formArray.reset();
      formArray.controls = []
    }

    switch (formControlName) {
      case 'sundaysHour':
        this.showSundays = !this.showSundays;
        break;

      case 'mondaysHour':
        this.showMondays = !this.showMondays;
        break;

      case 'tuesdaysHour':
        this.showTuesdays = !this.showTuesdays;
        break;

      case 'wednesdaysHour':
        this.showWednesdays = !this.showWednesdays;
        break;

      case 'thursdaysHour':
        this.showThursdays = !this.showThursdays;
        break;

      case 'fridaysHour':
        this.showFridays = !this.showFridays;
        break;

      case 'saturdaysHour':
        this.showSaturdays = !this.showSaturdays;
        break;
    }
  }

  public removeEverythingFromString(): void {
    let nameToUrl = this.formShortEstablishment.get('name')?.value;
    nameToUrl = nameToUrl
    .normalize('NFD') // Normaliza para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .replace(/[^\w\s]/gi, '') // Remove caracteres especiais e pontuação
    .replace(/\s+/g, '-') // Substitui espaços por -
    .toLowerCase() // Transforma tudo em minúsculas
    .trim(); // Remove espaços em branco no início e no fim

    this.formShortEstablishment.patchValue({ url: nameToUrl })
  }

  public closeModal(): void {
    this.modalCtrl.dismiss();
    this.formShortEstablishment.reset();
    this.store.dispatch(AppStore.clearCurrentEstablishment());

    this.currentEstablishment = this.establishment;

    if (this.establishment$) {
      this.establishmentSubscription.unsubscribe();
    }
  }

  checkFormErrors() {
    Object.keys(this.formShortEstablishment.controls).forEach(key => {
      const controlErrors = this.formShortEstablishment.get(key)?.errors;
      if (controlErrors) {
        console.log(`Erro no campo ${key}:`, controlErrors);
      }
    });
  }

  public getCurrentEstablishmentFromNGRX(): void {
    this.establishment$ = this.store.select(AppStore.selectCurrentEstablishment);

    this.establishmentSubscription = this.establishment$
    .subscribe({
      next: async (establishment: IPlace) => {
        this.currentEstablishment = establishment;

        if (this.currentEstablishment.name) {
          await this.fillFormAndVariablesWhenComesFromDetail(this.currentEstablishment);
        }
      }
    })
  }

  public async fillFormAndVariablesWhenComesFromDetail(establishment: IPlace) {

    console.log(establishment);


    this.establishment.adress.type = { ...establishment.adress.type };

    this.formShortEstablishment.get('type')?.patchValue(this.establishment.adress.type.pt);

    this.formShortEstablishment.get('name')?.patchValue(establishment.name);
    this.formShortEstablishment.get('sub_name')?.patchValue(establishment.sub_name);
    //this.formShortEstablishment.get('url')?.patchValue(establishment.value);
    this.removeEverythingFromString()

    let specialties: string[] = establishment.specialty.map((specialty: IPlaceSpecialty) => {
      return specialty.value
    })

    this.formShortEstablishment.get('specialty')?.patchValue(specialties);

    this.formShortEstablishment.get('workAt')?.patchValue(establishment.work_place);

    if (establishment.work_place.length === 1 && establishment.work_place[0] === LocationEnum.CIDADE) {
      this.MOCK_PLACES_TYPE = this.MOCK_CITY_PLACES_TYPE;
    }

    if (establishment.work_place.length === 1 && establishment.work_place[0] === LocationEnum.PRAIA) {
      this.MOCK_PLACES_TYPE = this.MOCK_BEACH_PLACES_TYPE;
    }

    if (establishment.work_place.length > 1) {
      this.MOCK_PLACES_TYPE = [
        ...this.MOCK_CITY_PLACES_TYPE,
        ...this.MOCK_BEACH_PLACES_TYPE
      ]
    }

    this.formShortEstablishment.get('mainType')?.patchValue(establishment.mainType.value);

    this.formShortEstablishment.get('zip_code')?.patchValue(establishment.adress.zip_code);
    this.formShortEstablishment.get('street')?.patchValue(establishment.adress.street);
    this.formShortEstablishment.get('neighborhood')?.patchValue(establishment.adress.neighborhood);
    this.formShortEstablishment.get('number')?.patchValue(establishment.adress.number);


    this.formShortEstablishment.get('hasAirConditioned')?.patchValue(establishment.air_conditioned_info.has_air_conditioned);
    this.formShortEstablishment.get('showAirConditionedField')?.patchValue(establishment.air_conditioned_info.show_field);


    this.formShortEstablishment.get('hasLiveMusic')?.patchValue(establishment.livemusic_info.has_livemusic);
    this.formShortEstablishment.get('showLiveMusic')?.patchValue(establishment.livemusic_info.show_field);

    this.formShortEstablishment.get('hasBooking')?.patchValue(establishment.booking_info.accept_booking);
    this.formShortEstablishment.get('showBooking')?.patchValue(establishment.booking_info.show_field);

    this.formShortEstablishment.get('isPetFriendly')?.patchValue(establishment.petfriendly_info.accept_petfriendly);
    this.formShortEstablishment.get('showPetFriendly')?.patchValue(establishment.petfriendly_info.show_field);

    this.formShortEstablishment.get('acceptVale')?.patchValue(establishment.ticket_info.accept_ticket);
    this.formShortEstablishment.get('showVale')?.patchValue(establishment.ticket_info.show_field);

    this.formShortEstablishment.get('hasChildrenSpace')?.patchValue(establishment.children_space.has_space);
    this.formShortEstablishment.get('showChildrenSpace')?.patchValue(establishment.children_space.show_field);
    this.formShortEstablishment.get('childrenSpaceIsPaid')?.patchValue(establishment.children_space.is_paid);

    let ticketNames: string[] = establishment.ticket_info.tickets.map((ticket: ITicket) => {
      return ticket.value
    })

    this.formShortEstablishment.get('ticketName')?.patchValue(ticketNames);

    this.formShortEstablishment.get('acceptMarketVale')?.patchValue(establishment.market_ticket_info.accept_ticket);

    let marketTicketNames: string[] = establishment.market_ticket_info.tickets.map((ticket: ITicket) => {
      return ticket.value
    })

    this.formShortEstablishment.get('marketTicketName')?.patchValue(marketTicketNames);

    this.formShortEstablishment.get('showMarketVale')?.patchValue(establishment.market_ticket_info.show_field);

    establishment.phones.forEach((phone: IPhone) => {
      this.addPhone(phone);
    })

    establishment.networks.forEach((network: ISocialNetwork) => {
      this.addNetwork(network);
    })

    establishment.working_time.forEach((working_time: ITime) => {

      if (working_time.opening_time.length > 0) {
        switch (working_time.day_number) {
          case 0:
            this.showSundays = !this.showSundays;
            break;

          case 1:
            this.showMondays = !this.showMondays;
            break;

          case 2:
            this.showTuesdays = !this.showTuesdays;
            break;

          case 3:
            this.showWednesdays = !this.showWednesdays;
            break;

          case 4:
            this.showThursdays = !this.showThursdays;
            break;

          case 5:
            this.showFridays = !this.showFridays;
            break;

          case 6:
            this.showSaturdays = !this.showSaturdays;
            break;
        }
      }

      working_time.opening_time.forEach((hour: IHour) => {
        switch (working_time.day_number) {
          case 0:
            this.addSundaysHour(hour);
            break;

          case 1:
            this.addMondaysHour(hour);
            break;

          case 2:
            this.addTuesdaysHour(hour);
            break;

          case 3:
            this.addWednesdaysHour(hour);
            break;

          case 4:
            this.addThursdaysHour(hour);
            break;

          case 5:
            this.addFridaysHour(hour);
            break;

          case 6:
            this.addSaturdaysHour(hour);
            break;
        }
      })
    })

    this.formShortEstablishment.get('isBuilding')?.patchValue(establishment.isBuilding);
    this.formShortEstablishment.get('isPremium')?.patchValue(establishment.isPremium);
    this.formShortEstablishment.get('city')?.patchValue(establishment.origin.value);
    this.formShortEstablishment.get('suggestions')?.patchValue(establishment.suggestions);

    this.defineBeachSelector(establishment.origin.value);

    this.formShortEstablishment.get('mainBeach')?.patchValue(establishment.mainBeach);
    this.formShortEstablishment.get('beach')?.patchValue(establishment.beachInfo?.value);
    this.formShortEstablishment.get('makeDeliveryOnTheBeach')?.patchValue(establishment.delivery_sand?.make_delivery);
    this.formShortEstablishment.get('deliveryIsFreeOnTheBeach')?.patchValue(establishment.delivery_sand?.delivery_is_free);

    this.formShortEstablishment.get('offerFestival')?.patchValue(establishment.festival_info?.has_any_festival_type);
    this.formShortEstablishment.get('showOfferFestival')?.patchValue(establishment.festival_info?.show_field);

    if (establishment.festival_info?.festivals && establishment.festival_info?.festivals.length > 0) {
      establishment.festival_info?.festivals.forEach((festival: IFestivalFood, festivalIndex: number) => {
        this.addFestival(festival);

        if (festival.rules && festival.rules.length > 0) {
          festival.rules.forEach((rule: any) => {
            this.addRules(festivalIndex, rule);
          })
        }
      })
    }
  }

  public defineBeachSelector(cityValue: string) {
    switch (cityValue) {
      case CityEnum.SANTOS:
        this.MOCK_BEACHES = MOCK_SANTOS_BEACHES;
        break;

      case CityEnum.SAO_VICENTE:
        this.MOCK_BEACHES = MOCK_SAO_VICENTE_BEACHES;
        break;

      default:
        this.MOCK_BEACHES = [];
        break;
    }
  }

  ngOnDestroy() {
    this.suggestionsSubscription.unsubscribe();
  }

}
