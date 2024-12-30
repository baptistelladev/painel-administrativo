import { ProfileTypeEnum } from './../../../shared/enums/ProfileType';
import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services/firebase/users.service';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IUSer } from 'src/app/shared/models/IUser';
import Swiper from 'swiper';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit, AfterViewInit {

  public hideRightControl: boolean = false;
  public hideLeftControl: boolean = true;

  @ViewChild('usersSwiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

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

  public users: IUSer[];
  public users$: Observable<IUSer[]>;
  public usersSubscription: Subscription;

  public FeaturesEnum = FeaturesEnum;
  public ProfileTypeEnum = ProfileTypeEnum;

  constructor(
    private usersService : UsersService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  public ngAfterViewInit(): void {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  public async getUsers() {
    this.users$ = this.usersService
    .getUsersCollection(CollectionsEnum.USERS);

    this.usersSubscription = this.users$
    .subscribe( async (users: IUSer[]) => {
      this.users = users;

      this.defineResume(users);
    })
  }

  public listenForSwiperForControl(ev: any): void {
    this.hideLeftControl = ev.detail[0].isBeginning;
    this.hideRightControl = ev.detail[0].isEnd;
  }

  public trackUserById(user: any) {
    return user.id;
  }

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

  public slideToNext(): void {
    this.swiper?.slideNext(800);
  }

  public slideToPrev(): void {
    this.swiper?.slidePrev(800);
  }

}
