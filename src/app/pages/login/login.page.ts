import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, NavController } from '@ionic/angular';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { OverlayService } from 'src/app/shared/services/overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('passwordInput') passwordInput : IonInput;
  @ViewChild('emailInput') emailInput : IonInput;

  public isDoingLogin: boolean = false;

  public showLoginPassword: boolean = false;

  public formLoginGroup: FormGroup;

  public options: AnimationOptions = {
    path: './../../../assets/movie/anfitrion-around-the-world.json',
    autoplay: true,
    loop: true
  };

  constructor(
    public formBuilder : FormBuilder,
    public overlayService : OverlayService,
    public navCtrl : NavController,
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  public initLoginForm(): void {
    this.formLoginGroup = this.formBuilder.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ]
    })
  }

  public animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.8)
  }

  public async login() {

    const toastError = await this.overlayService.fireToast({
      position: 'top',
      cssClass: 'anf-toast anf-toast-danger',
      icon: 'warning-outline',
      duration: 2000
    });

    const toastSuccess = await this.overlayService.fireToast({
      position: 'top',
      cssClass: 'anf-toast anf-toast-success',
      icon: 'finger-print-outline',
      duration: 3000
    });

    this.isDoingLogin = true;

    await this.authService.signInWithEmailAndPassword(this.formLoginGroup.value.email, this.formLoginGroup.value.password)
    .then( async (user: any) => {

      const passwordInput = this.passwordInput.getInputElement();
      passwordInput.then((input) => input.blur());

      const emailInput = this.emailInput.getInputElement();
      emailInput.then((input) => input.blur());

      if (user.emailVerified) {
        toastSuccess.message = `Aguarde o redirecionamento`;
        await toastSuccess.present();

        await toastSuccess.onDidDismiss()
        .then(() => {
          this.formLoginGroup.reset();
          this.isDoingLogin = false;
          this.navCtrl.navigateForward(['/logado']);
        })
      } else {
        await toastError.present();
        this.isDoingLogin = false;
      }
    })
    .catch(async (error: any) => {
      this.isDoingLogin = false;
      toastError.message = error.text;
      await toastError.present();
    })
  }

  public toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

}
