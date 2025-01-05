import { ProfileTypeEnum } from './../../../shared/enums/ProfileType';
import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services/firebase/users.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IUSer } from 'src/app/shared/models/IUser';
import Swiper from 'swiper';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as AppStore from './../../../shared/store/app.state';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { UserInfoModalComponent } from 'src/app/shared/components/modais/user-info-modal/user-info-modal.component';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('usersSwiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  public touristOptions: AnimationOptions = {
    path: './../../../../assets/movie/anfitrion-tourists.json',
    autoplay: true,
    loop: true
  };

  public residentOptions: AnimationOptions = {
    path: './../../../../assets/movie/anfitrion-residents.json',
    autoplay: true,
    loop: true
  };

  public users: IUSer[];
  public users$: Observable<IUSer[]>;
  public usersSubscription: Subscription;

  public FeaturesEnum = FeaturesEnum;
  public ProfileTypeEnum = ProfileTypeEnum;

  public usersResume: any[] = [
    {
      length: null,
      sub_title: 'contas',
      title: 'cadastradas',
      value: 'USUARIOS_CADASTRADOS'
    },
    {
      length: null,
      sub_title: 'contas',
      title: 'premium',
      value: 'USUARIOS_PREMIUM'
    },
    {
      length: null,
      sub_title: 'contas',
      title: 'free',
      value: 'USUARIOS_NAO_PREMIUM'
    }
  ]

  public hideRightControl: boolean = false;
  public hideLeftControl: boolean = true;

  public touristsLength: null | number;
  public residentsLength: null | number;
  public profileTypeNotDefinedLength: null | number;

  constructor(
    private usersService : UsersService,
    private navCtrl : NavController,
    private modalCtrl : ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  public ngAfterViewInit(): void {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  /**
   * @description Obtém usuários e define o length das opções.
   */
  public async getUsers() {
    this.users$ = this.usersService
    .getUsersCollection(CollectionsEnum.USERS);

    this.usersSubscription = this.users$
    .subscribe( async (users: IUSer[]) => {
      this.users = users;

      this.defineResume(users);
      this.defineTouristsAndResidentsLength(users);
    })
  }

  /**
   * @description Detecta mudanças no swiper para esconder o botão de próximo e anterior conforme o slide estiver no começo ou fim.
   */
  public listenForSwiperForControl(ev: any): void {
    this.hideLeftControl = ev.detail[0].isBeginning;
    this.hideRightControl = ev.detail[0].isEnd;
  }

  /**
   * @description Usado no NGFOR.
   */
  public trackUserById(user: any) {
    return user.id;
  }

  /**
   * @description Define o length das opções.
   */
  public defineTouristsAndResidentsLength(users: IUSer[]): void {
    if (users) {
      this.profileTypeNotDefinedLength = users.filter((user: IUSer) => {
        return !user.userType
      }).length

      this.residentsLength = users.filter((user: IUSer) => {
        return user.userType?.value === ProfileTypeEnum.MORADOR
      }).length

      this.touristsLength = users.filter((user: IUSer) => {
        return user.userType?.value === ProfileTypeEnum.TURISTA
      }).length
    }
  }

  /**
   * @description Define o length das opções.
   */
  public defineResume(users: IUSer[]): void {
    this.usersResume.forEach((resume: any) => {
      if (resume.value === 'USUARIOS_CADASTRADOS') {
        resume.length = users.length;
      }

      if (resume.value === 'USUARIOS_PREMIUM') {
        resume.length = users.filter((user: IUSer) => {
          return user.premiumInfo.isPremium
        }).length
      }

      if (resume.value === 'USUARIOS_NAO_PREMIUM') {
        resume.length = users.filter((user: IUSer) => {
          return !user.premiumInfo.isPremium
        }).length
      }
    })
  }

  /**
   * @description Passa para o próximo slide.
   */
  public slideToNext(): void {
    this.swiper?.slideNext(800);
  }

  /**
   * @description Passa para o slide anterior.
   */
  public slideToPrev(): void {
    this.swiper?.slidePrev(800);
  }

  /**
   * @description Guarda o usuário selecionado no NGRX e abre o modal com o formulário.
   */
  public async seeUser(user: IUSer) {
    this.store.dispatch(AppStore.setCurrentUser({ currentUser: user } ))
    this.openModalUserDetails();
  }

  /**
   * @description Abre modal com os detalhes do usuário.
   */
  public async openModalUserDetails(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: UserInfoModalComponent,
      mode: 'md',
      cssClass: 'rgs-register',
      id: 'update-user'
    });

    await modal.present();

    return modal;
  }

  /**
   * @description Seta a velocidade da animação específica.
   */
  public touristAnimationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.8);
  }

  /**
   * @description Seta a velocidade da animação específica.
   */
  public residentsAnimationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.8)
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
