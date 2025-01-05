import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { IonDatetime, ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services/firebase/users.service';
import { MOCK_USER_SEX } from 'src/app/shared/mocks/MockUserSex';
import { MOCK_USER_TYPES } from 'src/app/shared/mocks/MockUserTypes';
import { ILang } from 'src/app/shared/models/ILang';
import { IUSer } from 'src/app/shared/models/IUser';
import { IUserSex } from 'src/app/shared/models/IUserSex';
import { UserTypeEnum } from 'src/app/shared/enums/UserType';
import { OverlayService } from 'src/app/shared/services/overlay.service';
import * as AppStore from 'src/app/shared/store/app.state';
import { IUserType } from 'src/app/shared/models/IUserType';
@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss'],
})
export class UserInfoModalComponent implements OnInit, OnDestroy {

  public UserTypeEnum = UserTypeEnum;

  public today = moment();
  public eightenYearsLimitDate = this.today.subtract(18, 'years');
  public respectAgeLimit: boolean = false;

  public interfaceOptions: any = {
    showBackdrop: true,
    backdropDismiss: true,
    cssClass: 'select-alert',
    mode: 'ios',
    keyboardClose: true,
    id: 'select-user-type',
    size: 'auto',
    dismissOnSelect: true,
    side: 'bottom',
    alignment: '',
    arrow: true,
  }

  public todayAsDatetime = moment().format('YYYY-MM-DD');
  public maxDateAsDatetime = moment().subtract(16, 'years').format('YYYY-MM-DD');

  @ViewChild('birthDateDatetime') birthDateDatetime: IonDatetime;

  public showBirthDateModal: boolean = false;

  public formHasChanges: boolean;
  public formHasChanges$: Observable<boolean>;
  public formHasChangesSubscription: Subscription;

  public user: IUSer;
  public user$: Observable<IUSer>;
  public userSubscription: Subscription;

  public personalDataForm: FormGroup;

  public MOCK_USER_SEX: IUserSex[] = MOCK_USER_SEX;
  public MOCK_USER_TYPES: IUserType[] = MOCK_USER_TYPES;

  public isUpdatingProfile: boolean = false;

  constructor(
    private store : Store,
    private title : Title,
    private navCtrl : NavController,
    private formBuilder : FormBuilder,
    private modalCtrl : ModalController,
    private usersService : UsersService,
    private overlayService : OverlayService
  ) { }

  ngOnInit() {
    this.initPersonalDataForm();
    this.getUserFromNGRX();
    this.listenFormChanges();
  }

  ionViewWillEnter(): void {
    this.title.setTitle('Seus dados');
  }

  /**
   * @description Voltar para página anterior.
   */
  public back(): void {
    this.navCtrl.back()
  }

  /**
   * @description Inicializa o formulário.
   */
  public initPersonalDataForm(): void {
    this.personalDataForm = this.formBuilder.group({
      name: [ '', [ Validators.required, Validators.minLength(3) ] ],
      birthDateAsDate: [ '' ],
      birthDateAsText: [ '', [ Validators.required ] ],
      secondName: [ '', [ Validators.required ] ],
      type: [ '', [ Validators.required ] ],
      sex: [ '', [ Validators.required ] ],
      isPremium: [ '', [ Validators.required ] ]
    })
  }

  /**
   * @description Obtém o usuário previamente selecionado e guardado no NGRX.
   */
  public getUserFromNGRX(): void {
    this.user$ = this.store.select(AppStore.selectCurrentUser);

    this.userSubscription = this.user$
    .subscribe((user: IUSer) => {
      this.user = user;
      if (this.user) {
        this.fillFormAndVariable(user);
        this.initialBirthDateFormat();
      }
    })
  }

  /**
   * @description Limpa o campo deixando somente o primeiro nome.
   */
  public clearFieldKeepJustName(event: any): void {
    let name: string = this.personalDataForm.value.name.replace(/[^a-zA-ZÀ-ÿ]/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
    this.personalDataForm.patchValue({ name: name });
  }

  /**
   * @description Previne o espaço de ser digitado.
   */
  public preventWhitespace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  /**
   * @description Mostra e esconde o calendário de data de nascimento.
   */
  public toggleBirthDateModal(show: boolean): void {
    this.showBirthDateModal = show;
  }

  /**
   * @description Detecta mudanças na data de nascimento.
   */
  public birthDateChanged(e: any): void {
    this.personalDataForm.patchValue({
      birthDateAsText: moment(e.detail.value).format('DD/MM/YYYY')
    })

    if (moment(e.detail.value).isSameOrBefore(this.eightenYearsLimitDate)) {
      this.respectAgeLimit = true;
    } else {
      this.respectAgeLimit = false;
    }

  }

  /**
   * @description Define o formato da data de nascimento pois vem na versão americana.
   */
  public initialBirthDateFormat(): void {
    if (this.personalDataForm.value.birthDateAsText) {
      this.personalDataForm.patchValue({
        birthDateAsText: moment(this.personalDataForm.value.birthDateAsText).format('DD/MM/YYYY')
      })
    }
  }

  /**
   * @description Preenche o forulário.
   */
  public fillFormAndVariable(user: IUSer): void {
    this.personalDataForm.patchValue({
      name: user.firstName,
      secondName: user.lastName,
      type: user.userType?.value,
      sex: user?.sex,
      isPremium: user.premiumInfo?.isPremium
    })


    if (user.birthDate) {
      this.personalDataForm.patchValue({
        birthDateAsText: user.birthDate,
        birthDateAsDate: user.birthDate
      })
    } else {
      this.personalDataForm.patchValue({
        birthDateAsText: '',
        birthDateAsDate: this.maxDateAsDatetime
      })
    }

    if (moment(user.birthDate).isSameOrBefore(this.eightenYearsLimitDate)) {
      this.respectAgeLimit = true;
    } else {
      this.respectAgeLimit = false;
    }
  }

  /**
   * @description Define a data de nascimento.
   */
  public defineBirthDate(): void {
    this.birthDateDatetime.confirm(true);
  }

  /**
   * @description Detecta mudanças na relação com a Baixada Santista.
   */
  public relationshipChanged(): void {
    console.log(this.personalDataForm.value.type);
  }

  /**
   * @description Detecta mudanças no sexo.
   */
  public sexChanged(): void {
    console.log(this.personalDataForm.value.sex);
  }

  /**
   * @description Escuta por mudanças no formulário.
   */
  public listenFormChanges(): void {
    this.formHasChanges$ = this.personalDataForm.valueChanges;

    this.formHasChangesSubscription = this.formHasChanges$
    .subscribe((res: any) => {
      this.formHasChanges = res;
    })
  }

  /**
   * @description Atualiza o perfil do usuário.
   */
  public async updateProfile() {
    const alertSuccess = await this.overlayService.fireAlert({
      backdropDismiss: false,
      cssClass: 'anf-alert',
      mode: 'ios',
      subHeader: `Perfil atualizado`,
      message: `Atulizamos o perfil com sucesso`,
      buttons: [
        {
          text: `Tudo bem`,
          role: 'confirm',
          handler: async () => {
            await alertSuccess.dismiss();
            this.modalCtrl.dismiss();
            this.isUpdatingProfile = false;
          }
        }
      ]
    })

    if (this.user.uid) {
      this.isUpdatingProfile = true;

      let userInfo = {
        firstName: this.personalDataForm.value.name,
        lastName: this.personalDataForm.value.secondName,
        birthDate: moment(this.personalDataForm.value.birthDateAsDate).format('YYYY-MM-DD'),
        userType: this.MOCK_USER_TYPES.find(( userType: IUserType ) => { return userType.value === this.personalDataForm.value.type }),
        sex: this.personalDataForm.value.sex,
        premiumInfo: {
          isPremium: this.personalDataForm.value.isPremium
        }
      }

      await this.usersService.updateUserInfo(this.user.uid, userInfo)
      .then(async () => {
        if (moment(this.personalDataForm.value.birthDateAsDate, 'YYYY-MM-DD').isSameOrBefore(this.eightenYearsLimitDate)) {
          this.store.dispatch(AppStore.setEighteenAccessFromCurrentUser({ canAccessEighteenContent: true }));
        } else {
          this.store.dispatch(AppStore.setEighteenAccessFromCurrentUser({ canAccessEighteenContent: false }));
        }

        await alertSuccess.present();
      })
      .catch(() => {
        this.isUpdatingProfile = false;
      })
    }
  }

  /**
   * @description Fechar modal.
   */
  public async closeModal() {
    await this.modalCtrl.dismiss().then(() => {
      this.personalDataForm.reset();
    })
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.formHasChangesSubscription.unsubscribe();
  }

}
