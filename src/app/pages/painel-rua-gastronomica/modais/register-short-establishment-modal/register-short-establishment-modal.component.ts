import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormArrayName, FormBuilder, FormGroup } from '@angular/forms';
import { IonDatetime, ModalController } from '@ionic/angular';
import { ESTABLISHMENT_TYPES } from 'src/app/shared/mocks/establishmentTypes';
import { NETWORKS } from 'src/app/shared/mocks/networks';
import { TICKETS } from 'src/app/shared/mocks/tickets';
import { IShortEstablishment } from 'src/app/shared/models/Establishment';
import { IEstablishmentType } from 'src/app/shared/models/EstablishmentType';
import { ISocialNetwork } from 'src/app/shared/models/Network';
import { IShortTicket } from 'src/app/shared/models/Ticket';

@Component({
  selector: 'app-register-short-establishment-modal',
  templateUrl: './register-short-establishment-modal.component.html',
  styleUrls: ['./register-short-establishment-modal.component.scss'],
})
export class RegisterShortEstablishmentModalComponent  implements OnInit {

  public selectedTime: any;

  // USADO PARA MANIPULARO DATETIME.
  @ViewChild('datetime') datetime: IonDatetime;
  public timerDatetime: boolean = false;

  public formShortEstablishment: FormGroup;

  public shortEstablishment: IShortEstablishment;

  public ESTABLISHMENT_TYPES: IEstablishmentType[] = ESTABLISHMENT_TYPES;
  public TICKETS: IShortTicket[] = TICKETS;
  public NETWORKS: ISocialNetwork[] = NETWORKS;

  constructor(
    private formBuilder : FormBuilder,
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.initFormShortEstablishment()
  }

  public initFormShortEstablishment(): void {
    this.formShortEstablishment = this.formBuilder.group({
      name: '',
      mainType: '',
      zip_code: '',
      street: '',
      neighborhood: '',
      number : '',
      ticketName: '',
      phones: this.formBuilder.array([]),
      networks: this.formBuilder.array([]),
      mondaysHour: this.formBuilder.array([]),
      tuesdaysHour: this.formBuilder.array([]),
      wednesdaysHour: this.formBuilder.array([]),
      thursdaysHour: this.formBuilder.array([]),
      fridaysHour: this.formBuilder.array([]),
      saturdarsHour: this.formBuilder.array([]),
      sundaysHour: this.formBuilder.array([])
    })
  }

  public async mainTypeChanged(e: any) {
    console.log(e);
  }

  public async ticketChanged(e: any) {
    console.log(e);
  }

  get phones(): FormArray {
    return this.formShortEstablishment.get('phones') as FormArray;
  }

  public addPhone() {
    const phoneGroup = this.formBuilder.group({
      ddd: '',
      number: '',
    });
    this.phones.push(phoneGroup);
  }

  public removePhone(index: number) {
    this.phones.removeAt(index);
  }

  get networks(): FormArray {
    return this.formShortEstablishment.get('networks') as FormArray;
  }

  public addNetwork() {
    const networkGroup = this.formBuilder.group({
      value: '',
      user: ''
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

  public addMondaysHour() {
    const hourGroup = this.formBuilder.group({
      open: '',
      close: ''
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

  public addTuesdaysHour() {
    const hourGroup = this.formBuilder.group({
      open: '',
      close: ''
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
  get thursdaysHour(): FormArray {
    return this.formShortEstablishment.get('thursdaysHour') as FormArray;
  }
  get fridaysHour(): FormArray {
    return this.formShortEstablishment.get('fridaysHour') as FormArray;
  }
  get saturdarsHour(): FormArray {
    return this.formShortEstablishment.get('saturdarsHour') as FormArray;
  }
  get sundaysHour(): FormArray {
    return this.formShortEstablishment.get('sundaysHour') as FormArray;
  }
}
