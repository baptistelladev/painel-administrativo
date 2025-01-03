import { AdminService } from './../../../../core/services/firebase/admin.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/core/services/utils.service';
import { UserTypeEnum } from 'src/app/shared/enums/UserType';
import { MOCK_USER_TYPES } from 'src/app/shared/mocks/MockUserTypes';
import { IAdmin } from 'src/app/shared/models/IAdmin';
import { IUserType } from 'src/app/shared/models/IUserType';
import { OverlayService } from 'src/app/shared/services/overlay.service';

@Component({
  selector: 'app-admins-modal',
  templateUrl: './admins-modal.component.html',
  styleUrls: ['./admins-modal.component.scss'],
})
export class AdminsModalComponent  implements OnInit {

  public isCreating: boolean = false;

  public passwordsMatch: boolean = false;
  public passwordIsValid: boolean = false;
  public passwordRules: any[];

  public passwordMatch: {text: any} = {
    text: {
      pt: 'senhas coincidem',
      en: 'passwords match',
      es: 'las contraseñas coinciden'
    }
  }

  public showCreatePassword: boolean = false;
  public showCreateConfirmPassword: boolean = false;

  public MOCK_USER_TYPES: IUserType[] = MOCK_USER_TYPES;

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

  public adminsFormGroup: FormGroup;

  public user: any;

  public inputErrors: any = {
    emailAlreadyInUse: {
      show: false,
      text: null
    }
  }

  public UserTypeEnum = UserTypeEnum;

  constructor(
    private formBuilder : FormBuilder,
    private modalCtrl : ModalController,
    private utilsService : UtilsService,
    private adminService : AdminService,
    private overlayService : OverlayService
  ) { }

  async ngOnInit() {
    this.initAdminForm();
    this.getPasswordRules();
  }

  public getPasswordRules(): void {
    this.passwordRules = this.utilsService.getPasswordRules();
  }

  private initAdminForm(): void {
    this.adminsFormGroup = this.formBuilder.group({
      name: [ null, [ Validators.required, Validators.minLength(3) ]],
      email: [ null, [ Validators.required, Validators.email ]],
      role: [ UserTypeEnum.ADMINISTRADOR, [ Validators.required ]],
      isAdmin: [ true, [ Validators.required ]],
      password: [ '', [ Validators.required, Validators.minLength(8) ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength(8) ] ]
    })
  }

  public closeModal(): void {
    this.modalCtrl.dismiss(null, '', 'register-admin');
  }

  public clearFieldKeepJustName(event: any): void {
    let name: string = this.adminsFormGroup.value.name.replace(/[^a-zA-ZÀ-ÿ]/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
    this.adminsFormGroup.patchValue({ name: name });
  }

  preventWhitespace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  public clearErrorsIfExists(error: string): void {
    if (error === 'email-already-in-use' && this.inputErrors.emailAlreadyInUse.show) {
      this.inputErrors.emailAlreadyInUse.show = false;
      this.inputErrors.emailAlreadyInUse.text = null;
    }
  }

  public justLowercase(form: FormGroup, field: string): void {
    let value: string = form.value[field];

    if (value && value.length) {
      value = value.toLowerCase();
      form.patchValue({ [field]: value });
    }
  }

  public relationshipChanged(): void {
    console.log(this.adminsFormGroup.value.type);
  }

  public checkPasswordsMatch(): boolean {
    this.passwordsMatch = this.adminsFormGroup.value.password === this.adminsFormGroup.value.confirmPassword

    if (this.adminsFormGroup.value.password === '' || this.adminsFormGroup.value.confirmPassword === '') {
      this.passwordsMatch = false
    }

    return this.passwordsMatch
  }

  public toggleCreatePassword(): void {
    this.showCreatePassword = !this.showCreatePassword;
  }

  public toggleCreateConfirmPassword(): void {
    this.showCreateConfirmPassword = !this.showCreateConfirmPassword;
  }

  public checkPasswordRules(): void {
    let senha: string = this.adminsFormGroup.get('password')?.value;

    if (senha.length > 0) {
      this.utilsService.checkPasswordRules(senha);
      this.passwordIsValid = this.passwordRules.every((rule) => rule.valid === true);

      this.checkPasswordsMatch();
    }
  }

  public async registerAdmin() {
    this.isCreating = true;

    const toastError = await this.overlayService.fireToast({
      position: 'top',
      cssClass: 'anf-toast anf-toast-danger',
      icon: 'warning-outline',
      duration: 3000
    })

    const toastSuccess = await this.overlayService.fireToast({
      position: 'top',
      cssClass: 'anf-toast anf-toast-success',
      icon: 'person-add-outline',
      duration: 3000
    })

    let adminInfo: IAdmin = {
      firstName: this.adminsFormGroup.value.name,
      role: this.MOCK_USER_TYPES.find((userType: IUserType) => {
        return userType.value === this.adminsFormGroup.value.role
      }),
      isAdmin: this.adminsFormGroup.value.isAdmin
    }

    this.adminService.createUserWithEmailAndPassword(this.adminsFormGroup.value.email, this.adminsFormGroup.value.password, adminInfo)
    .then(async () => {
      this.isCreating = false;
      this.adminsFormGroup.patchValue({ email: this.adminsFormGroup.value.email });
      this.adminsFormGroup.reset();
      this.showCreatePassword = false;
      this.showCreateConfirmPassword = false;
      this.passwordRules.forEach((rule) => rule.valid = false);
      this.passwordIsValid = false;
      this.passwordsMatch = false;
      this.inputErrors.emailAlreadyInUse.show = false;
      this.inputErrors.emailAlreadyInUse.text = null;
      this.closeModal();

      toastSuccess.message = `Conta criada, <b>com sucesso</b>`;
      await toastSuccess.present();
    }).catch( async (error) => {
      toastError.message = error.text.pt;

      switch (error.error.code) {
        case 'auth/email-already-in-use':
          this.inputErrors.emailAlreadyInUse.text = toastError.message;
          this.inputErrors.emailAlreadyInUse.show = true;
        break;
      }

      await toastError.present();

      this.isCreating = false;

      await toastError.onDidDismiss()
      .then(() => {
        toastError.message = '';
      })
    })
  }

}
