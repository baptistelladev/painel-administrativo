import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})
export class UsersModalComponent  implements OnInit {

  public showCreatePassword: boolean = false;
  public showCreateConfirmPassword: boolean = false;

  public showTermsAndConditionsModal: boolean = false;

  public passwordMatch: {text: any} = {
    text: {
      pt: 'senhas coincidem'
    }
  }

  public passwordRules: any[];
  public passwordIsValid: boolean = false;
  public passwordsMatch: boolean = false;

  public createUserFormGroup : FormGroup;

  public isCreating: boolean = false;

  public inputErrors: any = {
    emailAlreadyInUse: {
      show: false,
      text: null
    }
  }

  constructor(
    private modalCtrl : ModalController,
    private formBuilder : FormBuilder,
    private utilsService : UtilsService
  ) { }

  ngOnInit() {
    this.initCreateUserForm();
    this.getPasswordRules();
  }

  public getPasswordRules(): void {
    this.passwordRules = this.utilsService.getPasswordRules();
  }

  public closeModal(): void {
    this.modalCtrl.dismiss();
    this.passwordRules.forEach((rule) => rule.valid = false);
  }

  public register(): void {
    this.isCreating = true;

    setTimeout(() => {
      this.isCreating = false;
    }, 2000);
  }

  public initCreateUserForm(): void {
    this.createUserFormGroup = this.formBuilder.group({
      name: [ '', [ Validators.required, Validators.minLength(3) ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength(8) ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength(8) ] ],
      terms: [ null, [ Validators.required ]]
    })
  }

  preventWhitespace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  public clearFieldKeepJustName(event: any): void {
    let name: string = this.createUserFormGroup.value.name.replace(/[^a-zA-ZÀ-ÿ]/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
    this.createUserFormGroup.patchValue({ name: name });
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

  public toggleCreateConfirmPassword(): void {
    this.showCreateConfirmPassword = !this.showCreateConfirmPassword;
  }

  public toggleCreatePassword(): void {
    this.showCreatePassword = !this.showCreatePassword;
  }

  public checkPasswordsMatch(): boolean {
    this.passwordsMatch = this.createUserFormGroup.value.password === this.createUserFormGroup.value.confirmPassword

    if (this.createUserFormGroup.value.password === '' && this.createUserFormGroup.value.confirmPassword === '') {
      this.passwordsMatch = false
    }

    return this.passwordsMatch
  }

  public toggleTermsAndConditionsModal(show: boolean): void {
    this.showTermsAndConditionsModal = show
  }

  public checkPasswordRules(): void {
    let senha: string = this.createUserFormGroup.get('password')?.value;

    if (senha.length > 0) {
      this.utilsService.checkPasswordRules(senha);
      this.passwordIsValid = this.passwordRules.every((rule) => rule.valid === true);

      this.checkPasswordsMatch();
    }
  }
}
