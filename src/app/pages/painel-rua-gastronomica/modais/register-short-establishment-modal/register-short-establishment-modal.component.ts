import { SPECIALTIES } from './../../../../shared/mocks/specialties';


import { AfterViewInit, Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { FormArray, FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, IonTab, IonToggle, ModalController } from '@ionic/angular';
import { min, Observable, ObservableLike, Subscription, take } from 'rxjs';
import { CepService } from 'src/app/core/services/cep.service';
import { EstablishmentsService } from 'src/app/core/services/firebase/establishments.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { EstablishmentTypeEnum } from 'src/app/shared/enums/EstablishmentType';
import { DAYS } from 'src/app/shared/mocks/days';
import { ESTABLISHMENT_TYPES } from 'src/app/shared/mocks/establishmentTypes';
import { MARKET_TICKETS } from 'src/app/shared/mocks/marketTickets';
import { NETWORKS } from 'src/app/shared/mocks/networks';
import { PHONES } from 'src/app/shared/mocks/phones';
import { TICKETS } from 'src/app/shared/mocks/tickets';
import { IAdress } from 'src/app/shared/models/Endereco';
import { IShortEstablishment } from 'src/app/shared/models/Establishment';
import { IEstablishmentSpecialty } from 'src/app/shared/models/EstablishmentSpecialty';
import { IEstablishmentType } from 'src/app/shared/models/EstablishmentType';
import { ISocialNetwork } from 'src/app/shared/models/Network';
import { IPhone } from 'src/app/shared/models/Phone';
import { IShortTicket } from 'src/app/shared/models/Ticket';
import { ITime } from 'src/app/shared/models/Time';
import * as RuaGastronomicaDeSantosStore from './../../../../shared/store/ruaGastronomicaDeSantos.state';
import { Store } from '@ngrx/store';
import { IHour } from 'src/app/shared/models/Hour';

@Component({
  selector: 'app-register-short-establishment-modal',
  templateUrl: './register-short-establishment-modal.component.html',
  styleUrls: ['./register-short-establishment-modal.component.scss'],
})
export class RegisterShortEstablishmentModalComponent  implements OnInit, AfterViewInit {

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

  public shortEstablishment: IShortEstablishment = {
    isBuilding: false,
    id: '',
    name: '',
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
        user: ''
      }
    ]
  }

  public ESTABLISHMENT_TYPES: IEstablishmentType[] = ESTABLISHMENT_TYPES;
  public TICKETS: IShortTicket[] = TICKETS;
  public MARKET_TICKETS: IShortTicket[] = MARKET_TICKETS;
  public NETWORKS: ISocialNetwork[] = NETWORKS;
  public PHONES: IPhone[] = PHONES;
  public DAYS: ITime[] = DAYS;
  public SPECIALTIES: IEstablishmentSpecialty[] = SPECIALTIES;

  public EstablishmentTypeEnum = EstablishmentTypeEnum;

  public currentEstablishment: IShortEstablishment;
  public establishment$: Observable<IShortEstablishment>;
  public establishmentSubscription: Subscription;

  constructor(
    private formBuilder : FormBuilder,
    private modalCtrl : ModalController,
    private establishmentService : EstablishmentsService,
    private cepService : CepService,
    private store : Store
  ) { }

  ngOnInit() {
    this.initFormShortEstablishment();
    this.getCurrentEstablishmentFromNGRX();
  }

  ngAfterViewInit(): void {

  }

  public initFormShortEstablishment(): void {
    this.formShortEstablishment = this.formBuilder.group({
      name: ['', [ Validators.required, Validators.minLength(2) ]],
      specialty: [''],
      mainType: ['', [ Validators.required ]],
      zip_code: ['', [ Validators.required, Validators.minLength(8) ]],
      type: ['', [ Validators.required ]],
      street: ['', Validators.required ],
      neighborhood: ['', Validators.required ],
      number : ['', Validators.required ],
      hasAirConditioned: [false, Validators.required ],
      showAirConditionedField: [true, Validators.required ],
      hasLiveMusic: [false, Validators.required ],
      showLiveMusic: [true, Validators.required ],
      hasBooking: [false, Validators.required ],
      showBooking: [true, Validators.required ],
      isPetFriendly: [false, Validators.required ],
      showPetFriendly: [true, Validators.required ],
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
      isPremium: [false, [ Validators.required ]]
    })
  }

  public async registerEstablishment(type: 'create' | 'update') {
    this.isRegistering = true;

    if (this.currentEstablishment.id) {
      this.shortEstablishment.id = this.currentEstablishment.id;
    }

    this.shortEstablishment.name = this.formShortEstablishment.get('name')?.value;

    let foundType: IEstablishmentType | undefined = this.ESTABLISHMENT_TYPES.find((type: IEstablishmentType) => {
      return type.value === this.formShortEstablishment.get('mainType')?.value
    })

    if (foundType) {
      this.shortEstablishment.mainType = foundType;
    }

    this.shortEstablishment.adress.zip_code = this.formShortEstablishment.get('zip_code')?.value;
    this.shortEstablishment.adress.street = this.formShortEstablishment.get('street')?.value;
    this.shortEstablishment.adress.neighborhood = this.formShortEstablishment.get('neighborhood')?.value;
    this.shortEstablishment.adress.number = this.formShortEstablishment.get('number')?.value;

    this.shortEstablishment.air_conditioned_info.has_air_conditioned = this.formShortEstablishment.get('hasAirConditioned')?.value;
    this.shortEstablishment.air_conditioned_info.show_field = this.formShortEstablishment.get('showAirConditionedField')?.value;

    this.shortEstablishment.booking_info.accept_booking = this.formShortEstablishment.get('hasBooking')?.value;
    this.shortEstablishment.booking_info.show_field = this.formShortEstablishment.get('showBooking')?.value;

    this.shortEstablishment.livemusic_info.has_livemusic = this.formShortEstablishment.get('hasLiveMusic')?.value;
    this.shortEstablishment.livemusic_info.show_field = this.formShortEstablishment.get('showLiveMusic')?.value;

    this.shortEstablishment.petfriendly_info.accept_petfriendly = this.formShortEstablishment.get('isPetFriendly')?.value;
    this.shortEstablishment.petfriendly_info.show_field = this.formShortEstablishment.get('showPetFriendly')?.value;

    this.shortEstablishment.ticket_info.accept_ticket = this.formShortEstablishment.get('acceptVale')?.value;
    this.shortEstablishment.ticket_info.show_field = this.formShortEstablishment.get('showVale')?.value;


    if (this.formShortEstablishment.get('ticketName')?.value && this.formShortEstablishment.get('ticketName')?.value.length > 0) {
      let ticketValues = this.formShortEstablishment.get('ticketName')?.value

      console.log(ticketValues);


      let ticketsFiltered: IShortTicket[] = this.TICKETS.filter((ticket: IShortTicket) => ticketValues.some((value: string) => ticket.value === value) )

      this.shortEstablishment.ticket_info.tickets = ticketsFiltered;

    } else {
      this.shortEstablishment.ticket_info.tickets = [];
    }

    // ALIMENTAÇÃO
    this.shortEstablishment.market_ticket_info.accept_ticket = this.formShortEstablishment.get('acceptMarketVale')?.value;
    this.shortEstablishment.market_ticket_info.show_field = this.formShortEstablishment.get('showMarketVale')?.value;

    if (this.formShortEstablishment.get('marketTicketName')?.value && this.formShortEstablishment.get('marketTicketName')?.value.length > 0) {
      let ticketValues = this.formShortEstablishment.get('marketTicketName')?.value

      let ticketsFiltered: IShortTicket[] = this.TICKETS.filter((ticket: IShortTicket) => ticketValues.some((value: string) => ticket.value === value) )

      this.shortEstablishment.market_ticket_info.tickets = ticketsFiltered;

    } else {
      this.shortEstablishment.market_ticket_info.tickets = [];
    }

    if (this.formShortEstablishment.get('networks')?.value && this.formShortEstablishment.get('networks')?.value.length > 0) {
      let networksValues = this.formShortEstablishment.get('networks')?.value;

      let filteredNetworks: ISocialNetwork[] = [...this.NETWORKS].filter((network: ISocialNetwork) => {
        return networksValues.some((obj: any) => {
          if (network.value === obj['value']) {
            network.user = obj['user']
          }

          return network.value === obj['value']
        })
      });

      this.shortEstablishment.networks = filteredNetworks;
    } else {
      this.shortEstablishment.networks = [];
    }

    if (this.formShortEstablishment.get('phones')?.value && this.formShortEstablishment.get('phones')?.value.length > 0) {
      let phonesValues = this.formShortEstablishment.get('phones')?.value

      let filteredPhones: IPhone[] = [...this.PHONES].filter((phone: IPhone) => {
        return phonesValues.some((obj: any) => {
          if (phone.type === obj['type']) {
            phone.ddd = obj['ddd'];
            phone.number = obj['number'];
          }

          return phone.type === obj['type']
        })
      });

      this.shortEstablishment.phones = filteredPhones;

    } else {
      this.shortEstablishment.phones = [];
    }

    let working_time = [...this.DAYS].map((day: ITime) => {
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

    this.shortEstablishment.working_time = working_time;

    this.shortEstablishment.value = this.formShortEstablishment.get('url')?.value;

    if (this.formShortEstablishment.get('specialty')?.value && this.formShortEstablishment.get('specialty')?.value.length > 0) {
      let specialtiesValues = this.formShortEstablishment.get('specialty')?.value

      let specialtiesFiltered: IEstablishmentSpecialty[] = this.SPECIALTIES.filter((specialty: IEstablishmentSpecialty) => specialtiesValues.some((value: string) => specialty.value === value) )

      this.shortEstablishment.specialty = specialtiesFiltered;

    } else {
      this.shortEstablishment.specialty = [];
    }

    this.shortEstablishment.isBuilding = this.formShortEstablishment.get('isBuilding')?.value;

    switch (this.formShortEstablishment.get('type')?.value) {
      case 'rua':
        this.shortEstablishment.adress.type.pt = 'Rua';
        this.shortEstablishment.adress.type.en = 'Street';
        this.shortEstablishment.adress.type.es = 'Calle';
        break;

      case 'avenida':
        this.shortEstablishment.adress.type.pt = 'Avenida';
        this.shortEstablishment.adress.type.en = 'Avenue';
        this.shortEstablishment.adress.type.es = 'Avenida';
        break;
    }

    if (type === 'create') {
      await this.establishmentService.addDoc(CollectionsEnum.SHORT_ESTABLISHMENTS, this.shortEstablishment)
      .then(async () => {
        await this.modalCtrl.dismiss({}, '', 'register-short-establishment');
        this.isRegistering = false;
      }).catch(() => {
        this.isRegistering = false;
      })
    } else {
      await this.establishmentService.setDoc(CollectionsEnum.SHORT_ESTABLISHMENTS, this.currentEstablishment.id, this.shortEstablishment)
      .then(async () => {
        await this.modalCtrl.dismiss({}, '', 'register-short-establishment');
        this.isRegistering = false;
      }).catch(() => {
        this.isRegistering = false;
      })
    }

  }

  public async mainTypeChanged(e: any) {
    if (e.detail.value === EstablishmentTypeEnum.EMPORIO) {
      this.formShortEstablishment.get(['acceptMarketVale', 'marketTicketName', 'showMarketVale'])?.addValidators([Validators.required]);
    } else {
      this.formShortEstablishment.get(['acceptMarketVale', 'marketTicketName', 'showMarketVale'])?.removeValidators([Validators.required]);
    }
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
          this.shortEstablishment.adress.type.pt = 'Rua';
          this.shortEstablishment.adress.type.en = 'Street';
          this.shortEstablishment.adress.type.es = 'Calle';
          break;

        case 'avenida':
          this.shortEstablishment.adress.type.pt = 'Avenida';
          this.shortEstablishment.adress.type.en = 'Avenue';
          this.shortEstablishment.adress.type.es = 'Avenida';
          break;
      }

      this.formShortEstablishment.patchValue({ street: shortStreetName });
      this.formShortEstablishment.patchValue({ neighborhood: adress.bairro });
      this.formShortEstablishment.patchValue({ type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() });
     })
    }

  }

  public async specialtyChanged(e: any) {
    console.log(e);
  }

  public async ticketChanged(e: any) {
    console.log(e);
  }

  public async marketTicketChanged(e: any) {
    console.log(e);
  }

  public async networkChanged(e: any) {
    console.log(e);

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

    if (this.establishment$) {
      this.currentEstablishment = this.shortEstablishment;
      this.store.dispatch(RuaGastronomicaDeSantosStore.clearCurrentEstablishment());
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
    this.establishment$ = this.store.select(RuaGastronomicaDeSantosStore.selectCurrentEstablishment);

    this.establishmentSubscription = this.establishment$
    .subscribe({
      next: async (establishment: IShortEstablishment) => {
        this.currentEstablishment = establishment;

        if (this.currentEstablishment.name) {
          await this.fillFormAndVariablesWhenComesFromDetail(this.currentEstablishment);
        }
      }
    })
  }

  public async fillFormAndVariablesWhenComesFromDetail(establishment: IShortEstablishment) {

    this.shortEstablishment.adress.type = { ...establishment.adress.type };

    this.formShortEstablishment.get('type')?.patchValue(this.shortEstablishment.adress.type.pt);

    this.formShortEstablishment.get('name')?.patchValue(establishment.name);
    //this.formShortEstablishment.get('url')?.patchValue(establishment.value);
    this.removeEverythingFromString()

    let specialties: string[] = establishment.specialty.map((specialty: IEstablishmentSpecialty) => {
      return specialty.value
    })

    this.formShortEstablishment.get('specialty')?.patchValue(specialties);

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

    let ticketNames: string[] = establishment.ticket_info.tickets.map((ticket: IShortTicket) => {
      return ticket.value
    })

    this.formShortEstablishment.get('ticketName')?.patchValue(ticketNames);

    this.formShortEstablishment.get('acceptMarketVale')?.patchValue(establishment.market_ticket_info.accept_ticket);

    let marketTicketNames: string[] = establishment.market_ticket_info.tickets.map((ticket: IShortTicket) => {
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

  }
}
