import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CepService } from 'src/app/core/services/cep.service';
import { ParkingsService } from 'src/app/core/services/firebase/parkings.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IAdress } from 'src/app/shared/models/Endereco';
import { IShortParking } from 'src/app/shared/models/IParking';

@Component({
  selector: 'app-register-short-parking',
  templateUrl: './register-short-parking.component.html',
  styleUrls: ['./register-short-parking.component.scss'],
})
export class RegisterShortParkingComponent  implements OnInit {

  public formShortParking: FormGroup;

  public isRegistering: boolean;

  public shortParking: IShortParking;

  constructor(
    private formBuilder : FormBuilder,
    private cepService : CepService,
    private parkingService : ParkingsService,
    private modalCtrl : ModalController
  ) {
    this.initVariable();
  }

  ngOnInit() {
    this.initFormShortParking();
  }

  public initVariable(): void {
    this.shortParking = {
      name: '',
      adress: {
        street: '',
        number: '',
        zip_code: '',
        neighborhood: '',

      },
      phone: {
        ddd: '',
        number: ''
      }
    }

    console.log(this.shortParking);

  }

  public initFormShortParking(): void {
    this.formShortParking = this.formBuilder.group({
      name: ['', [ Validators.required, Validators.minLength(2) ]],
      zip_code: ['', [ Validators.required, Validators.minLength(8) ]],
      street: ['', Validators.required ],
      number : ['', Validators.required ],
      neighborhood : ['', Validators.required ],
      ddd: '',
      phoneNumber: ''
    })
  }

  public async registerParking() {
    this.shortParking['name'] = this.formShortParking.get('name')?.value;

    this.shortParking.adress.zip_code = this.formShortParking.get('zip_code')?.value;
    this.shortParking.adress.street = this.formShortParking.get('street')?.value;
    this.shortParking.adress.number = this.formShortParking.get('number')?.value;

    this.shortParking.phone.ddd = this.formShortParking.get('ddd')?.value;
    this.shortParking.phone.number = this.formShortParking.get('phoneNumber')?.value;

    await this.parkingService.addDoc(CollectionsEnum.SHORT_PARKINGS, this.shortParking)
    .then(async () => {
      await this.modalCtrl.dismiss({}, '', 'register-short-parking');
      this.isRegistering = false;
    }).catch(() => {
      this.isRegistering = false;
    })
  }

  public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  public async getCep() {
    let cep = this.formShortParking.get('zip_code')?.value;

    if (cep.length > 8) {
      return;
    }

    if (cep.length === 8) {
     await this.cepService.getCep(cep).then((adress: IAdress) => {
        this.formShortParking.patchValue({ street: adress.logradouro });
        this.formShortParking.patchValue({ neighborhood: adress.bairro });
     })
    }

  }

}
