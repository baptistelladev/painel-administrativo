import { MOCK_USER_TYPES } from 'src/app/shared/mocks/MockUserTypes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { UserTypeEnum } from 'src/app/shared/enums/UserType';
import { IUSer } from 'src/app/shared/models/IUser';
import { OverlayService } from 'src/app/shared/services/overlay.service';
import { IUserType } from 'src/app/shared/models/IUserType';

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})
export class UsersModalComponent  implements OnInit {

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

  public passwordMatch: { text: any } = {
    text: {
      pt: 'senhas coincidem'
    }
  }

  public MOCK_USER_TYPES: IUserType[] = MOCK_USER_TYPES;

  public UserTypeEnum = UserTypeEnum;

  public createUserFormGroup : FormGroup;

  public passwordIsValid: boolean = false;
  public passwordsMatch: boolean = false;
  public showCreatePassword: boolean = false;
  public showCreateConfirmPassword: boolean = false;
  public showTermsAndConditionsModal: boolean = false;
  public isCreating: boolean = false;

  public passwordRules: any[];

  constructor(
    private modalCtrl : ModalController,
    private formBuilder : FormBuilder,
    private utilsService : UtilsService,
    private overlayService : OverlayService,
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.initCreateUserForm();
    this.getPasswordRules();
  }

  /**
   * @description Obtém regras das senhas.
   */
  public getPasswordRules(): void {
    this.passwordRules = this.utilsService.getPasswordRules();
  }

  /**
   * @description Fechar modal.
   */
  public closeModal(): void {
    this.modalCtrl.dismiss();
    this.passwordRules.forEach((rule) => rule.valid = false);
    this.passwordIsValid = false;
    this.showCreatePassword = false;
    this.showCreateConfirmPassword = false;
    this.inputErrors.emailAlreadyInUse.show = false;
    this.inputErrors.emailAlreadyInUse.text = null;
  }

  /**
   * @description Detecta mudanças na relação que o usuário tem com a Baixada Santista.
   */
  public relationshipChanged(): void {
    console.log(this.createUserFormGroup.value.type);
  }

  /**
   * @description Cria um usuário.
   */
  public async createAcc() {
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

    let userInfo: IUSer = {
      firstName: this.createUserFormGroup.value.name,
      readAndAcceptedTerms: this.createUserFormGroup.value.terms,
      premiumInfo: {
        isPremium: false
      },
      userType: this.MOCK_USER_TYPES.find((userType: IUserType) => {
        return userType.value === this.createUserFormGroup.value.type
      })
    }

    await this.authService.createUserWithEmailAndPassword(this.createUserFormGroup.value.email, this.createUserFormGroup.value.password, userInfo)
    .then(async () => {
      this.isCreating = false;
      this.createUserFormGroup.reset();
      this.closeModal();
      toastSuccess.message = `Parabéns, <b>conta criada com sucesso</b>`;
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

    setTimeout(() => {
      this.isCreating = false;
    }, 2000);
  }

  /**
   * @description Inicializa o formulário.
   */
  public initCreateUserForm(): void {
    this.createUserFormGroup = this.formBuilder.group({
      type: [null, [ Validators.required ]],
      name: [ '', [ Validators.required, Validators.minLength(3) ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength(8) ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength(8) ] ],
      terms: [ null, [ Validators.required ]]
    })
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
   * @description Limpa o nome no formuário deixando somente uma string.
   */
  public clearFieldKeepJustName(event: any): void {
    let name: string = this.createUserFormGroup.value.name.replace(/[^a-zA-ZÀ-ÿ]/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
    this.createUserFormGroup.patchValue({ name: name });
  }

  /**
   * @description Limpa erro no input se existir.
   */
  public clearErrorsIfExists(error: string): void {
    if (error === 'email-already-in-use' && this.inputErrors.emailAlreadyInUse.show) {
      this.inputErrors.emailAlreadyInUse.show = false;
      this.inputErrors.emailAlreadyInUse.text = null;
    }
  }

  /**
   * @description Torna a string somente letras minúsculas.
   */
  public justLowercase(form: FormGroup, field: string): void {
    let value: string = form.value[field];

    if (value && value.length) {
      value = value.toLowerCase();
      form.patchValue({ [field]: value });
    }
  }

  /**
   * @description Mostra e esconde a confirmação de senha.
   */
  public toggleCreateConfirmPassword(): void {
    this.showCreateConfirmPassword = !this.showCreateConfirmPassword;
  }

  /**
   * @description Mostra e esconde a senha.
   */
  public toggleCreatePassword(): void {
    this.showCreatePassword = !this.showCreatePassword;
  }

  /**
   * @description Checa se a senha e confirmação da senha coincidem.
   */
  public checkPasswordsMatch(): boolean {
    this.passwordsMatch = this.createUserFormGroup.value.password === this.createUserFormGroup.value.confirmPassword

    if (this.createUserFormGroup.value.password === '' && this.createUserFormGroup.value.confirmPassword === '') {
      this.passwordsMatch = false
    }

    return this.passwordsMatch
  }

  /**
   * @description Mostra e esconde o modal de Termos e Condições.
   */
  public toggleTermsAndConditionsModal(show: boolean): void {
    this.showTermsAndConditionsModal = show
  }

  /**
   * @description Checa as regras das senhas.
   */
  public checkPasswordRules(): void {
    let senha: string = this.createUserFormGroup.get('password')?.value;

    if (senha.length > 0) {
      this.utilsService.checkPasswordRules(senha);
      this.passwordIsValid = this.passwordRules.every((rule) => rule.valid === true);

      this.checkPasswordsMatch();
    }
  }
}
