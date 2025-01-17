import { AdminService } from './../../../../core/services/firebase/admin.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/core/services/utils.service';
import { UserTypeEnum } from 'src/app/shared/enums/UserType';
import { MOCK_USER_TYPES } from 'src/app/shared/mocks/MockUserTypes';
import { IAdmin } from 'src/app/shared/models/IAdmin';
import { IUserType } from 'src/app/shared/models/IUserType';
import { OverlayService } from 'src/app/shared/services/overlay.service';
import * as AppStore from 'src/app/shared/store/app.state';
import { getFunctions, httpsCallable } from "firebase/functions";
import { IRequestNewAdmin } from 'src/app/shared/models/IRequestCreateNewAdmin';

@Component({
  selector: 'app-admins-modal',
  templateUrl: './admins-modal.component.html',
  styleUrls: ['./admins-modal.component.scss'],
})
export class AdminsModalComponent  implements OnInit {

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

  public inputErrors: any = {
    emailAlreadyInUse: {
      show: false,
      text: null
    }
  }

  public passwordMatch: {text: any} = {
    text: {
      pt: 'senhas coincidem',
      en: 'passwords match',
      es: 'las contraseñas coinciden'
    }
  }

  public MOCK_USER_TYPES: IUserType[] = MOCK_USER_TYPES;

  public adminsFormGroup: FormGroup;

  public UserTypeEnum = UserTypeEnum;

  public isCreating: boolean = false;
  public passwordsMatch: boolean = false;
  public passwordIsValid: boolean = false;
  public showCreatePassword: boolean = false;
  public showCreateConfirmPassword: boolean = false;

  public passwordRules: any[];
  public user: any;

  public admin: IAdmin;
  public admin$: Observable<IAdmin>;
  public adminSubscription: Subscription;

  constructor(
    private store : Store,
    private formBuilder : FormBuilder,
    private modalCtrl : ModalController,
    private utilsService : UtilsService,
    private adminService : AdminService,
    private overlayService : OverlayService
  ) { }

  async ngOnInit() {
    this.initAdminForm();
    this.getPasswordRules();
    this.getAdminFromNGRX();
  }

  /**
   * @description Obtém o admin previamente selecionado e guardado no NGRX.
   */
  public getAdminFromNGRX(): void {
    this.admin$ = this.store.select(AppStore.selectCurrentAdmin);

    this.adminSubscription = this.admin$
    .subscribe((admin: IAdmin) => {
      this.admin = admin;
      if (this.admin) {
        this.fillAdminFormAndVariables(admin);
      }
    })
  }

  public fillAdminFormAndVariables(admin: IAdmin): void {
    this.adminsFormGroup.patchValue({
      name: admin.firstName,
      isAdmin: admin.isAdmin,
    })

    if (admin.role?.value) {
      this.adminsFormGroup.get('role')?.patchValue(admin.role.value)
    }
  }

  /**
   * @description Obtém as regras de senha.
   */
  public getPasswordRules(): void {
    this.passwordRules = this.utilsService.getPasswordRules();
  }

  /**
   * @description Inicializar o formulário responsável pelo cadastro ou atualização do administrador.
   */
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

  /**
   * @description Fechar modal.
   */
  public closeModal(): void {
    this.modalCtrl.dismiss(null, '', 'register-admin');
  }

  /**
   * @description Limpa o nome do usuário, deixando somente o primeiro nome.
   */
  public clearFieldKeepJustName(event: any): void {
    let name: string = this.adminsFormGroup.value.name.replace(/[^a-zA-ZÀ-ÿ]/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
    this.adminsFormGroup.patchValue({ name: name });
  }

  /**
   * @description Prevenir que o usuário digite espaço.
   */
  public preventWhitespace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

   /**
   * @description Limpar erro de input caso exista.
   */
  public clearErrorsIfExists(error: string): void {
    if (error === 'email-already-in-use' && this.inputErrors.emailAlreadyInUse.show) {
      this.inputErrors.emailAlreadyInUse.show = false;
      this.inputErrors.emailAlreadyInUse.text = null;
    }
  }

   /**
   * @description Torna o input com letras minúsculas.
   */
  public justLowercase(form: FormGroup, field: string): void {
    let value: string = form.value[field];

    if (value && value.length) {
      value = value.toLowerCase();
      form.patchValue({ [field]: value });
    }
  }

  /**
   * @description Checa se a senha e a confirmação da senha coincidem.
   */
  public relationshipChanged(): void {
    console.log(this.adminsFormGroup.value.type);
  }

  /**
   * @description Checa se a senha e a confirmação da senha coincidem.
   */
  public checkPasswordsMatch(): boolean {
    this.passwordsMatch = this.adminsFormGroup.value.password === this.adminsFormGroup.value.confirmPassword

    if (this.adminsFormGroup.value.password === '' || this.adminsFormGroup.value.confirmPassword === '') {
      this.passwordsMatch = false
    }

    return this.passwordsMatch
  }

  /**
   * @description Mostra e esconde a senha.
   */
  public toggleCreatePassword(): void {
    this.showCreatePassword = !this.showCreatePassword;
  }

  /**
   * @description Mostra e esconde a confirmação da senha.
   */
  public toggleCreateConfirmPassword(): void {
    this.showCreateConfirmPassword = !this.showCreateConfirmPassword;
  }

  /**
   * @description Checa se as regras das senha estão corretas.
   */
  public checkPasswordRules(): void {
    let senha: string = this.adminsFormGroup.get('password')?.value;

    if (senha.length > 0) {
      this.utilsService.checkPasswordRules(senha);
      this.passwordIsValid = this.passwordRules.every((rule) => rule.valid === true);

      this.checkPasswordsMatch();
    }
  }

  /**
   * @description Registra um admnistrador.
   */
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
