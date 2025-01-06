import { setCurrentAdmin } from './../../../shared/store/app.state';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AnimationOptions } from 'ngx-lottie';
import { Observable, Subscription } from 'rxjs';
import { AdminService } from 'src/app/core/services/firebase/admin.service';
import { AdminsModalComponent } from 'src/app/shared/components/modais/admins-modal/admins-modal.component';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { ProfileTypeEnum } from 'src/app/shared/enums/ProfileType';
import { IAdmin } from 'src/app/shared/models/IAdmin';
import Swiper from 'swiper';
import * as AppStore from 'src/app/shared/store/app.state';

@Component({
  selector: 'app-adms',
  templateUrl: './adms.page.html',
  styleUrls: ['./adms.page.scss'],
})
export class AdmsPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('adminSwiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  public admins: IAdmin[];
  public admins$: Observable<IAdmin[]>;
  public adminsSubscription: Subscription;

  public FeaturesEnum = FeaturesEnum;
  public ProfileTypeEnum = ProfileTypeEnum;

  public adminsResume: any[] = [
    {
      length: null,
      sub_title: 'admins',
      title: 'do projeto',
      value: 'ADMIN_GERAL'
    }
  ]

  public hideRightControl: boolean = false;
  public hideLeftControl: boolean = true;

  constructor(
    private adminService : AdminService,
    private navCtrl : NavController,
    private modalCtrl : ModalController,
    private store : Store,
    private alertCtrl : AlertController
  ) { }

  ngOnInit() {
    this.getAdmins();
  }

  public ngAfterViewInit(): void {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  /**
   * @description Obtém usuários e define o length das opções.
   */
  public async getAdmins() {
    this.admins$ = this.adminService
    .getAdminCollection(CollectionsEnum.ADMINS);

    this.adminsSubscription = this.admins$
    .subscribe( async (admins: IAdmin[]) => {
      this.admins = admins;

      this.defineResume(admins);
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
  public trackAdminById(admin: any) {
    return admin.id;
  }

  /**
   * @description Define o length das opções.
   */
  public defineResume(admins: IAdmin[]): void {
    this.adminsResume.forEach((resume: any) => {
      if (resume.value === 'ADMIN_GERAL') {
        resume.length = admins.length;
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
  public async seeAdmin(admin: IAdmin) {
    this.store.dispatch(AppStore.setCurrentAdmin({ currentAdmin: admin } ))
    this.openModalAdminDetails();
  }

  /**
   * @description Abre modal com os detalhes do usuário.
   */
  public async openModalAdminDetails(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: AdminsModalComponent,
      mode: 'md',
      cssClass: 'rgs-register',
      id: 'register-admin'
    });

    await modal.present();

    return modal;
  }

  /**
   * @description Mostrar um alerta para confirmar remoção de lugar.
   */
  public async showAlertToRemove(admin: IAdmin): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      message: `Confirmar remoção de ${admin.firstName}?`,
      subHeader: `${admin.firstName}`,
      cssClass: 'anfitrion-alert negative-btn',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Remover',
          role: 'confirm',
          handler: async () => {
            await alert.dismiss();
            if (admin.uid) {
              await this.adminService.removeAdminDoc(CollectionsEnum.ADMINS, admin.uid);
            }
          }
        },
      ]
    })

    await alert.present();

    return alert;
  }

  public ngOnDestroy(): void {
    this.adminsSubscription.unsubscribe();
  }

}
